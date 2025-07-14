import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID
const ADMIN_DISCORD_IDS = process.env.ADMIN_DISCORD_IDS.split(',')

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url))
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
        scope: "identify email guilds.join",
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      throw new Error("No access token received")
    }

    // 2. Get user info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userRes.json()
    if (!userData || !userData.id) {
      throw new Error("Failed to fetch user info")
    }

    // 3. Add user to your Discord server
    const guildRes = await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userData.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: tokenData.access_token,
      }),
    })

    if (!guildRes.ok) {
      const errText = await guildRes.text()
      console.error("Failed to add user to guild:", errText)
      throw new Error("Failed to add user to Discord server")
    }

    // 4. Check if the user is an admin
    const isAdmin = ADMIN_DISCORD_IDS.includes(userData.id)

    // 5. Create JWT token
    const token = jwt.sign(
      {
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
        isAdmin,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    )

    // 6. Set auth-token cookie
    const response = NextResponse.redirect(new URL(isAdmin ? "/admin" : "/upload", request.url))
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (err) {
    console.error("Discord OAuth error:", err)
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url))
  }
}
