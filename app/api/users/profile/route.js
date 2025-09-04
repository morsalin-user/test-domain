import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function POST(req) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const { username } = body || {}
  if (!username) return NextResponse.json({ error: "username required" }, { status: 400 })

  const db = await getDb()
  try {
    await db
      .collection("user_profiles")
      .updateOne(
        { clerkUserId: userId },
        { $set: { username, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true },
      )
    return NextResponse.json({ ok: true })
  } catch (e) {
    // Unique index could conflict
    return NextResponse.json({ error: "Username already taken" }, { status: 409 })
  }
}
