// api/admin/delete-single/route.js
import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { v2 as cloudinary } from "cloudinary"
import { getDb } from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"

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

    const { videoId } = await req.json()

    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
    }

    const db = await getDb()
    
    // Find the video to get publicId for Cloudinary deletion
    const video = await db.collection("files").findOne({ _id: new ObjectId(videoId) })
    
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Delete from Cloudinary first
    try {
      if (video.publicId) {
        await cloudinary.uploader.destroy(video.publicId, {
          resource_type: video.resourceType || "video"
        })
        console.log(`Deleted from Cloudinary: ${video.publicId}`)
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError)
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    const result = await db.collection("files").deleteOne({ _id: new ObjectId(videoId) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete video from database" }, { status: 500 })
    }

    console.log(`Video deleted successfully: ${videoId}`)
    return NextResponse.json({ success: true, message: "Video deleted successfully" })

  } catch (error) {
    console.error("Delete single video error:", error)
    return NextResponse.json({ 
      error: "Failed to delete video", 
      details: error.message 
    }, { status: 500 })
  }
}