import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { currentUser } from "@clerk/nextjs/server"
import { isAdminEmail } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { cloudinary } from "@/lib/cloudinary"

export const runtime = "nodejs"

export async function DELETE(_req, { params }) {
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress || ""
  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db = await getDb()
  const file = await db.collection("files").findOne({ _id: new ObjectId(params.id) })
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (file.publicId) {
    try {
      // Attempt multiple resource types
      await cloudinary.uploader.destroy(file.publicId, { resource_type: "video" })
      await cloudinary.uploader.destroy(file.publicId, { resource_type: "image" })
      await cloudinary.uploader.destroy(file.publicId, { resource_type: "raw" })
    } catch {}
  }

  await db.collection("files").deleteOne({ _id: file._id })
  return NextResponse.json({ ok: true })
}
