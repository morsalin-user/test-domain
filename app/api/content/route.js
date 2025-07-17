// api/content/route.js

import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Content from "@/models/Content"

export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    // Validate required fields
    const { title, description, category, downloadLink, author } = data
    if (!title || !description || !category || !downloadLink || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate image if provided
    if (data.image && !data.image.startsWith('data:image/')) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 })
    }

    // Check image size (base64 encoded, so roughly 4/3 the original size)
    if (data.image && data.image.length > 7000000) { // ~5MB limit
      return NextResponse.json({ error: "Image too large" }, { status: 400 })
    }

    const content = new Content({
      title: title.trim(),
      description: description.trim(),
      category,
      downloadLink: downloadLink.trim(),
      author: author.trim(),
      image: data.image || "",
      status: "pending",
      createdAt: new Date(),
    })

    await content.save()

    return NextResponse.json({ 
      success: true, 
      message: "Content submitted successfully",
      id: content._id 
    })
  } catch (error) {
    console.error("Error creating content:", error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }
    
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build query
    let query = { status: "approved" }
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ]
    }

    // Get total count for pagination
    const total = await Content.countDocuments(query)
    
    // Get content with pagination
    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}
