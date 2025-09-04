// /api/video/stream/[id]/route.js - New API for streaming videos (no download)
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "../../../../../lib/mongodb"

export const runtime = "nodejs"

export async function GET(req, { params }) {
  try {
    const db = await getDb()
    const doc = await db.collection("files").findOne({ _id: new ObjectId(params.id) })
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const cdn = doc.secureUrl || doc.mp4Url
    if (!cdn) return NextResponse.json({ error: "No file URL" }, { status: 400 })

    // Fetch video from Cloudinary
    const response = await fetch(cdn)
    if (!response.ok) {
      throw new Error('Failed to fetch video')
    }

    // Stream the video with headers that prevent downloading
    const videoStream = response.body
    
    return new NextResponse(videoStream, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'inline', // Force inline viewing, not download
        'Cache-Control': 'private, max-age=3600',
        'Accept-Ranges': 'bytes',
        // Security headers to prevent downloads
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'same-origin',
      },
    })
  } catch (error) {
    console.error('Streaming error:', error)
    return NextResponse.json({ error: "Failed to stream video" }, { status: 500 })
  }
}