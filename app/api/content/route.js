import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Content from "@/models/Content"

export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    const content = new Content({
      ...data,
      status: "pending",
      createdAt: new Date(),
    })

    await content.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const content = await Content.find({ status: "approved" }).sort({ createdAt: -1 })
    return NextResponse.json(content)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}
