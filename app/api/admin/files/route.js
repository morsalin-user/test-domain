import { NextResponse } from "next/server"
import { getDb } from "../../../../lib/mongodb"

export const runtime = "nodejs"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const limit = Math.min(Number(searchParams.get("limit") || 100), 200)

  const db = await getDb()
  const query = { resourceType: "video" }
  if (category && category !== "all") query.category = category

  const items = await db.collection("files").find(query).sort({ createdAt: -1 }).limit(limit).toArray()

  const mapped = items.map((it) => ({
    _id: it._id?.toString(),
    mp4Url: it.mp4Url || it.secureUrl,
    secureUrl: it.secureUrl,
    category: it.category,
    createdAt: it.createdAt,
    duration: it.duration,
    width: it.width,
    height: it.height,
  }))

  return NextResponse.json({ items: mapped })
}
