import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI
const ADMIN_GOOGLE_EMAILS = ["mursalim1246@gmail.com", "youradmin@gmail.com"] // Add your admin emails here

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url))
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      throw new Error("No access token received")
    }

    // 2. Get user info
    const userRes = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`)
    const userData = await userRes.json()

    if (!userData || !userData.id) {
      throw new Error("Failed to fetch user info")
    }

    // 3. Check if the user is an admin
    const isAdmin = ADMIN_GOOGLE_EMAILS.includes(userData.email)

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        isAdmin,
        provider: "google",
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    // 5. Set auth-token cookie
    const response = NextResponse.redirect(new URL(isAdmin ? "/admin" : "/upload", request.url))
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (err) {
    console.error("Google OAuth error:", err)
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url))
  }
}
