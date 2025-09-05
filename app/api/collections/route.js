// api/debug/collections/route.js

import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getDb } from "@/lib/mongodb"

export const runtime = "nodejs"

export async function GET(req) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const cu = await currentUser()
    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
    const email = cu?.primaryEmailAddress?.emailAddress || ""
    
    if (email.toLowerCase() !== adminEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const db = await getDb()
    
    // Get all collection names
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    
    // Check both 'videos' and 'files' collections
    const videosCount = await db.collection("videos").countDocuments().catch(() => 0)
    const filesCount = await db.collection("files").countDocuments().catch(() => 0)
    
    // Get sample documents from each collection
    const videosSample = await db.collection("videos").findOne().catch(() => null)
    const filesSample = await db.collection("files").findOne().catch(() => null)
    
    return NextResponse.json({
      collections: collectionNames,
      counts: {
        videos: videosCount,
        files: filesCount
      },
      samples: {
        videos: videosSample,
        files: filesSample
      }
    })
    
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      { error: "Failed to debug collections", details: error.message }, 
      { status: 500 }
    )
  }
}