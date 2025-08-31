// api/admin/save/route.js
import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { v2 as cloudinary } from "cloudinary"
import { getDb } from "../../../../lib/mongodb"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const runtime = "nodejs"

export async function POST(req) {
  try {
    const { userId, sessionId } = auth()
    if (!userId || !sessionId) {
      console.log("[v0] admin/save: no session", { userId, sessionId })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || ""
    if ((email || "").toLowerCase() !== adminEmail) {
      console.log("[v0] admin/save: forbidden for email", email)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await req.formData()
    const category = String(formData.get("category") || "other")
    const file = formData.get("file")
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Missing video file" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "video",
            type: "upload", // public delivery for easy playback
            folder: "media-vault/videos",
            overwrite: false,
          },
          (err, result) => (err ? reject(err) : resolve(result)),
        )
        .end(buffer)
    })

    const db = await getDb()
    const doc = {
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      mp4Url: uploadResult.secure_url,
      category,
      createdAt: new Date(),
      resourceType: "video",
      deliveryType: "upload",
      bytes: uploadResult.bytes,
      duration: uploadResult.duration,
      width: uploadResult.width,
      height: uploadResult.height,
      uploaderId: userId,
    }
    await db.collection("files").insertOne(doc)

    return NextResponse.json({ ok: true, file: { ...doc, _id: doc._id?.toString?.() } })
  } catch (e) {
    console.error("[v0] admin/save error:", e)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
