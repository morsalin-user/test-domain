// app/api/download/[id]/route.js
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { ObjectId } from "mongodb"
import { getDb } from "../../../../lib/mongodb"

export const runtime = "nodejs"

export async function GET(req, { params }) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db = await getDb()
  
  // Check daily download limit (5 per day)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Start of today
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1) // Start of tomorrow
  
  const todayDownloads = await db.collection("downloads").countDocuments({
    userId,
    at: {
      $gte: today,
      $lt: tomorrow
    }
  })
  
  if (todayDownloads >= 5) {
    return NextResponse.json({ 
      error: "Daily download limit reached", 
      message: "You can only download 5 videos per day. Try again tomorrow." 
    }, { status: 429 })
  }

  const doc = await db.collection("files").findOne({ _id: new ObjectId(params.id) })
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const cdn = doc.secureUrl || doc.mp4Url
  if (!cdn) return NextResponse.json({ error: "No file URL" }, { status: 400 })

  // Record the download BEFORE serving the file
  await db.collection("downloads").insertOne({ 
    fileId: doc._id, 
    userId, 
    at: new Date(),
    filename: doc.title || 'video'
  })

  // Fetch the video from Cloudinary and serve it directly
  try {
    const response = await fetch(cdn)
    if (!response.ok) {
      throw new Error('Failed to fetch video from CDN')
    }

    const videoBuffer = await response.arrayBuffer()
    const filename = `${doc.title || 'video'}.mp4`

    // Serve the video with download headers
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': videoBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: "Failed to download video" }, { status: 500 })
  }
}