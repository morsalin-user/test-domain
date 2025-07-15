import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Content from "@/models/Content"

export async function POST(request, { params }) {
  try {
    await connectDB()

    // Increment download count
    await Content.findByIdAndUpdate(params.id, { $inc: { downloads: 1 } }, { new: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating download count:", error)
    return NextResponse.json({ error: "Failed to update download count" }, { status: 500 })
  }
}
