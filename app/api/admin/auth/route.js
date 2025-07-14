import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
  try {
    const cookieStore = cookies()
    const adminToken = cookieStore.get("admin-token")
    const authToken = cookieStore.get("auth-token")

    if (adminToken) {
      jwt.verify(adminToken.value, process.env.JWT_SECRET || "your-secret-key")
      return NextResponse.json({ success: true })
    }

    if (authToken) {
      const decoded = jwt.verify(authToken.value, process.env.JWT_SECRET || "your-secret-key")
      if (decoded.isAdmin) {
        return NextResponse.json({ success: true })
      }
    }

    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
