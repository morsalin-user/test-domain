import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { ObjectId } from "mongodb"
import { getDb } from "../../../../lib/mongodb"

export const runtime = "nodejs"

export async function GET(_req, { params }) {
  const { userId, sessionId } = auth()
  if (!userId || !sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const db = await getDb()
  const doc = await db.collection("files").findOne({ _id: new ObjectId(params.id) })
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const url = new URL(doc.secureUrl || doc.mp4Url)
  url.searchParams.set("fl_attachment", "true") // prompt download

  await db.collection("downloads").insertOne({ fileId: doc._id, userId, at: new Date() })

  return NextResponse.redirect(url.toString())
}
