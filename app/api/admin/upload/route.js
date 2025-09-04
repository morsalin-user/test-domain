// api/admin/upload/route.js
import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { isAdminEmail } from "@/lib/auth"
import { cloudinary } from "@/lib/cloudinary"
import { getDb } from "@/lib/mongodb"

export const runtime = "nodejs"

export async function POST(req) {
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress || ""
  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get("file")
  const title = form.get("title") || "Untitled"
  const description = form.get("description") || ""
  const category = form.get("category") || "Misc"
  const type = form.get("type") || "video"

  if (!file || !file.arrayBuffer) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  let result
  try {
    result = await new Promise((resolve, reject) => {
      const up = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "media-vault", overwrite: false },
        (err, res) => (err ? reject(err) : resolve(res)),
      )
      up.end(buffer)
    })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }

  const db = await getDb()
  const doc = {
    title,
    description,
    category,
    type,
    url: result.secure_url,
    publicId: result.public_id,
    createdAt: new Date(),
    uploadedBy: user.id,
  }
  const { insertedId } = await db.collection("files").insertOne(doc)

  return NextResponse.json({ ok: true, id: insertedId })
}
