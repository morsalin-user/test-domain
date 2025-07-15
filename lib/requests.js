import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function DELETE(request, { params }) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "your-secret-key")

    await connectDB()
    const { default: Comment } = await import("@/models/Comment")

    const comment = await Comment.findById(params.commentId)
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user owns the comment or is admin
    if (comment.author.id !== decoded.id && !decoded.isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    await Comment.findByIdAndDelete(params.commentId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
