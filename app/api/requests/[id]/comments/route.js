import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET(request, { params }) {
  try {
    await connectDB()
    const { default: Comment } = await import("@/models/Comment")

    const comments = await Comment.find({
      contentId: params.id,
      contentType: "request",
    })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(JSON.parse(JSON.stringify(comments)))
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "your-secret-key")
    const { content } = await request.json()

    await connectDB()
    const { default: Comment } = await import("@/models/Comment")

    const newComment = new Comment({
      contentId: params.id,
      contentType: "request",
      content,
      author: {
        id: decoded.id,
        name: decoded.name,
        username: decoded.username,
        email: decoded.email,
        picture: decoded.picture || decoded.avatar,
      },
    })

    await newComment.save()
    return NextResponse.json(JSON.parse(JSON.stringify(newComment)))
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
