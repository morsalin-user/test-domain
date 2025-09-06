// api/admin/delete-all/route.js
import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { v2 as cloudinary } from "cloudinary"
import { getDb } from "../../../../lib/mongodb"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  try {
    // Authentication check
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || ""
    
    if ((email || "").toLowerCase() !== adminEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const db = await getDb()
    
    // Get all videos to delete from Cloudinary
    const videos = await db.collection("files").find({}).toArray()
    
    if (videos.length === 0) {
      return NextResponse.json({ message: "No videos to delete" })
    }

    console.log(`Starting deletion of ${videos.length} videos...`)

    // Delete from Cloudinary
    let cloudinaryDeletedCount = 0
    let cloudinaryFailedCount = 0

    for (const video of videos) {
      if (video.publicId) {
        try {
          await cloudinary.uploader.destroy(video.publicId, {
            resource_type: video.resourceType || "video"
          })
          cloudinaryDeletedCount++
          console.log(`Deleted from Cloudinary: ${video.publicId}`)
        } catch (cloudinaryError) {
          console.error(`Cloudinary deletion failed for ${video.publicId}:`, cloudinaryError)
          cloudinaryFailedCount++
        }
      }
    }

    // Delete all from database
    const result = await db.collection("files").deleteMany({})

    console.log(`Database deletion result: ${result.deletedCount} documents deleted`)
    console.log(`Cloudinary: ${cloudinaryDeletedCount} deleted, ${cloudinaryFailedCount} failed`)

    return NextResponse.json({ 
      success: true, 
      message: "All videos deleted successfully",
      stats: {
        databaseDeleted: result.deletedCount,
        cloudinaryDeleted: cloudinaryDeletedCount,
        cloudinaryFailed: cloudinaryFailedCount
      }
    })

  } catch (error) {
    console.error("Delete all videos error:", error)
    return NextResponse.json({ 
      error: "Failed to delete all videos", 
      details: error.message 
    }, { status: 500 })
  }
}