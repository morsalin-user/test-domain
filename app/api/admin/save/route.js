import { NextResponse } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server"
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
    const { userId, sessionId } = getAuth(req)
    if (!userId || !sessionId) {
      console.log("[v0] admin/save: no session", { userId, sessionId })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
    const user = await clerkClient.users.getUser(userId)
    const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || ""
    if ((email || "").toLowerCase() !== adminEmail) {
      console.log("[v0] admin/save: forbidden for email", email)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await req.formData()

    const title = String(formData.get("title") || "").trim()
    const description = String(formData.get("description") || "").trim()
    const category = String(formData.get("category") || "other")
    const fileType = String(formData.get("fileType") || "video")
    const file = formData.get("file")
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const resourceType = fileType === "file" ? "raw" : "video"
    const folder = resourceType === "video" ? "media-vault/videos" : "media-vault/files"

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            type: "upload",
            folder,
            overwrite: false,
          },
          (err, result) => (err ? reject(err) : resolve(result)),
        )
        .end(buffer)
    })

    const db = await getDb()
    const doc = {
      title,
      description,
      category,
      fileType,
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      mp4Url: resourceType === "video" ? uploadResult.secure_url : undefined,
      resourceType,
      deliveryType: "upload",
      bytes: uploadResult.bytes,
      duration: uploadResult.duration,
      width: uploadResult.width,
      height: uploadResult.height,
      uploaderId: userId,
      createdAt: new Date(),
    }
    await db.collection("files").insertOne(doc)

    const location = new URL("/admin?uploaded=1", req.url)
    return NextResponse.redirect(location)
  } catch (e) {
    console.error("[v0] admin/save error:", e)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
