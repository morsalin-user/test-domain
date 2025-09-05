// api/admin/files/route.js

import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getDb } from "@/lib/mongodb"

export const runtime = "nodejs"

export async function GET(request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const cu = await currentUser()
    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
    const email = cu?.primaryEmailAddress?.emailAddress || ""
    
    if (email.toLowerCase() !== adminEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const db = await getDb()
    
    // Check both collections to see which one has data
    const videosCount = await db.collection("videos").countDocuments().catch(() => 0)
    const filesCount = await db.collection("files").countDocuments().catch(() => 0)
    
    let collection, total, files
    
    if (videosCount > 0) {
      // Use videos collection
      collection = db.collection("videos")
      total = videosCount
      console.log("Using 'videos' collection, count:", total)
    } else if (filesCount > 0) {
      // Use files collection
      collection = db.collection("files")
      total = filesCount
      console.log("Using 'files' collection, count:", total)
    } else {
      // No data in either collection
      console.log("No data found in either 'videos' or 'files' collections")
      return NextResponse.json({
        files: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasMore: false
      })
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit
    
    // Get files with pagination
    files = await collection
      .find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .toArray()
    
    // Normalize the data structure - ensure all files have the required fields
    const normalizedFiles = files.map(file => ({
      _id: file._id,
      title: file.title || 'Untitled',
      description: file.description || '',
      category: file.category || 'Misc',
      fileType: file.fileType || file.type || 'video',
      secureUrl: file.secureUrl || file.secure_url || file.mp4Url,
      publicId: file.publicId || file.public_id,
      createdAt: file.createdAt || file.uploadedAt || new Date(),
      resourceType: file.resourceType || (file.fileType === 'video' ? 'video' : 'raw'),
      bytes: file.bytes,
      duration: file.duration,
      width: file.width,
      height: file.height
    }))
    
    return NextResponse.json({
      files: normalizedFiles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + limit < total,
      debug: {
        videosCount,
        filesCount,
        usingCollection: videosCount > 0 ? 'videos' : 'files'
      }
    })
    
  } catch (error) {
    console.error("Admin files API error:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch files", 
        files: [],
        total: 0,
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}