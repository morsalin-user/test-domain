import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
  try {
    await connectDB()
    const { default: Request } = await import("@/models/Request")

    const requests = await Request.find({ status: "open" }).sort({ createdAt: -1 }).lean()

    return NextResponse.json(JSON.parse(JSON.stringify(requests)))
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "your-secret-key")
    const data = await request.json()

    await connectDB()
    const { default: Request } = await import("@/models/Request")

    const newRequest = new Request({
      ...data,
      author: {
        id: decoded.id,
        name: decoded.name || decoded.username,
        email: decoded.email,
        picture: decoded.picture || decoded.avatar,
      },
    })

    await newRequest.save()
    return NextResponse.json(JSON.parse(JSON.stringify(newRequest)))
  } catch (error) {
    console.error("Error creating request:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
