// api/admin/linkvertise/[id]/route.js

import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Content from "@/models/Content"

export async function POST(request, { params }) {
  try {
    await connectDB()
    
    const { id } = params
    const { linkvertiseLink } = await request.json()

    // Validate the linkvertise link if provided
    if (linkvertiseLink && linkvertiseLink.trim()) {
      try {
        new URL(linkvertiseLink)
      } catch {
        return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
      }
    }

    // Find and update the content
    const content = await Content.findById(id)
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    // Update the linkvertise link
    content.linkvertiseLink = linkvertiseLink?.trim() || ""
    await content.save()

    return NextResponse.json({ 
      success: true, 
      message: "Linkvertise link updated successfully",
      linkvertiseLink: content.linkvertiseLink 
    })
  } catch (error) {
    console.error("Error updating linkvertise link:", error)
    return NextResponse.json({ error: "Failed to update linkvertise link" }, { status: 500 })
  }
}
