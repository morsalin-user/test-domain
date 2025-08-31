// api/users/upsert/route.js

// <CHANGE> upsert user with hashed password
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/mongodb"
import { auth } from "@clerk/nextjs/server"

export async function POST(req) {
  try {
    const { userId } = auth()
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Missing email or password" }, { status: 400 })
    }
    const db = await getDb()
    const users = db.collection("users")
    const passwordHash = await bcrypt.hash(password, 12)
    const now = new Date()
    await users.updateOne(
      { email },
      {
        $set: { email, passwordHash, clerkUserId: userId || null, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[v0] upsert user error:", e)
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}
