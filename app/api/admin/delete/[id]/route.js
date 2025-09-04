import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"
import { cloudinary } from "@/lib/cloudinary"

export async function DELETE(_req, { params }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const cu = await currentUser()
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
  const email = cu?.primaryEmailAddress?.emailAddress || ""
  if (email.toLowerCase() !== adminEmail) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const id = params.id
  const db = await getDb()
  const doc = await db.collection("videos").findOne({ _id: new ObjectId(id) })
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (doc.public_id) {
    await cloudinary.uploader.destroy(doc.public_id, { resource_type: "video" })
  }
  await db.collection("videos").deleteOne({ _id: new ObjectId(id) })
  return NextResponse.json({ ok: true })
}
