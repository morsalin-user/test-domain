// api/admin/delete-all/route.js

import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getDb } from "@/lib/mongodb"
import { cloudinary } from "@/lib/cloudinary"

export const runtime = "nodejs"

export async function DELETE(req) {
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
    
    // Check both collections and delete from both
    const videosFiles = await db.collection("videos").find({}).toArray()
    const filesFiles = await db.collection("files").find({}).toArray()
    const allFiles = [...videosFiles, ...filesFiles]
    
    // Delete from Cloudinary
    const deletePromises = allFiles.map(async (file) => {
      const publicId = file.publicId || file.public_id
      if (publicId) {
        try {
          const resourceType = (file.fileType || file.type) === 'video' ? 'video' : 'raw'
          await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
        } catch (error) {
          console.error(`Failed to delete ${publicId} from Cloudinary:`, error)
        }
      }
    })
    
    await Promise.allSettled(deletePromises)
    
    // Delete all files from both collections
    const videosResult = await db.collection("videos").deleteMany({})
    const filesResult = await db.collection("files").deleteMany({})
    const totalDeleted = videosResult.deletedCount + filesResult.deletedCount
    
    console.log(`Deleted ${videosResult.deletedCount} from videos collection`)
    console.log(`Deleted ${filesResult.deletedCount} from files collection`)
    console.log(`Total deleted: ${totalDeleted}`)
    
    return NextResponse.json({ 
      success: true, 
      deletedCount: totalDeleted,
      details: {
        videosDeleted: videosResult.deletedCount,
        filesDeleted: filesResult.deletedCount
      },
      message: `Successfully deleted ${totalDeleted} files`
    })
    
  } catch (error) {
    console.error("Delete all error:", error)
    return NextResponse.json(
      { error: "Failed to delete all files", details: error.message }, 
      { status: 500 }
    )
  }
}