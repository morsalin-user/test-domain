import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const ADMIN_EMAILS = ["admin@example.com"]

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" })

    const response = NextResponse.json({ success: true })
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400, // 24 hours
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
