import { NextResponse } from "next/server"

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI

export async function GET() {
  const scopes = ["identify", "email", "guilds.join"].join(" ")
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}`

  // const discordAuthUrl = "https://discord.com/oauth2/authorize?client_id=1394199828476596290&scope=bot&permissions=8"
  return NextResponse.redirect(discordAuthUrl)
}
