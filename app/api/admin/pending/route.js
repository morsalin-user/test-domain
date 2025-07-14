import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Content from "@/models/Content"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
  try {
    const cookieStore = cookies()
    const adminToken = cookieStore.get("admin-token")
    const authToken = cookieStore.get("auth-token")

    let isAuthorized = false

    if (adminToken) {
      jwt.verify(adminToken.value, process.env.JWT_SECRET || "your-secret-key")
      isAuthorized = true
    } else if (authToken) {
      const decoded = jwt.verify(authToken.value, process.env.JWT_SECRET || "your-secret-key")
      if (decoded.isAdmin) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectDB()
    const pendingContent = await Content.find({ status: "pending" }).sort({ createdAt: -1 })

    return NextResponse.json(pendingContent)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pending content" }, { status: 500 })
  }
}
