import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const ADMIN_GOOGLE_EMAILS = ["admin@gmail.com", "youradmin@gmail.com"] // Add your admin emails here

export async function POST(request) {
  try {
    const { credential, isAdmin } = await request.json()

    // Decode the JWT credential from Google
    const payload = jwt.decode(credential)

    if (!payload) {
      throw new Error("Invalid credential")
    }

    // Check if the user is an admin
    const userIsAdmin = ADMIN_GOOGLE_EMAILS.includes(payload.email)

    // If this is an admin login attempt but user is not admin, reject
    if (isAdmin && !userIsAdmin) {
      return NextResponse.json({ error: "Not authorized as admin" }, { status: 403 })
    }

    // Create our own JWT token
    const token = jwt.sign(
      {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        isAdmin: userIsAdmin,
        provider: "google",
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    // Set auth-token cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Google verify error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
