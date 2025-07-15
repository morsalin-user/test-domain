import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET(request, { params }) {
  try {
    await connectDB()
    const { default: Reaction } = await import("@/models/Reaction")

    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")
    let userId = null

    if (token) {
      try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "your-secret-key")
        userId = decoded.id
      } catch (error) {
        // Token invalid, continue without user
      }
    }

    // Get reaction counts
    const likes = await Reaction.countDocuments({
      contentId: params.id,
      contentType: "content",
      reaction: "like",
    })

    const dislikes = await Reaction.countDocuments({
      contentId: params.id,
      contentType: "content",
      reaction: "dislike",
    })

    // Get user's reaction if logged in
    let userReaction = null
    if (userId) {
      const reaction = await Reaction.findOne({
        contentId: params.id,
        contentType: "content",
        userId,
      })
      userReaction = reaction?.reaction || null
    }

    return NextResponse.json({
      likes,
      dislikes,
      userReaction,
    })
  } catch (error) {
    console.error("Error fetching reactions:", error)
    return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 })
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
    const { reaction } = await request.json()

    await connectDB()
    const { default: Reaction } = await import("@/models/Reaction")

    // Remove existing reaction
    await Reaction.deleteOne({
      contentId: params.id,
      contentType: "content",
      userId: decoded.id,
    })

    // Add new reaction if different from existing
    const existingReaction = await Reaction.findOne({
      contentId: params.id,
      contentType: "content",
      userId: decoded.id,
    })

    let userReaction = null
    if (!existingReaction || existingReaction.reaction !== reaction) {
      await new Reaction({
        contentId: params.id,
        contentType: "content",
        userId: decoded.id,
        reaction,
      }).save()
      userReaction = reaction
    }

    // Get updated counts
    const likes = await Reaction.countDocuments({
      contentId: params.id,
      contentType: "content",
      reaction: "like",
    })

    const dislikes = await Reaction.countDocuments({
      contentId: params.id,
      contentType: "content",
      reaction: "dislike",
    })

    return NextResponse.json({
      likes,
      dislikes,
      userReaction,
    })
  } catch (error) {
    console.error("Error updating reaction:", error)
    return NextResponse.json({ error: "Failed to update reaction" }, { status: 500 })
  }
}
