// api/clerk/cleanup/route.js
// <CHANGE> cleanup unverified Clerk users older than N minutes by email
import { NextResponse } from "next/server"
const CLERK_BASE = "https://api.clerk.com/v1"

export async function POST(req) {
  try {
    const { email, minutes = 15 } = await req.json()
    if (!email) return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 })
    if (!process.env.CLERK_SECRET_KEY) {
      return NextResponse.json({ ok: false, error: "Missing CLERK_SECRET_KEY" }, { status: 500 })
    }

    const qs = new URLSearchParams({ email_address: email, limit: "10" }).toString()
    const listRes = await fetch(`${CLERK_BASE}/users?${qs}`, {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
      cache: "no-store",
    })
    const payload = await listRes.json()
    const cutoff = Date.now() - Number(minutes) * 60_000

    const targets =
      payload?.data?.filter((u) => {
        const created = Number(u?.created_at || 0)
        const verified = (u?.email_addresses || []).some((e) => e?.verification?.status === "verified")
        return !verified && created && created < cutoff
      }) || []

    const deleted = []
    for (const u of targets) {
      const delRes = await fetch(`${CLERK_BASE}/users/${u.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
      })
      deleted.push({ id: u.id, ok: delRes.ok })
    }

    return NextResponse.json({ ok: true, deleted })
  } catch (e) {
    console.error("[v0] clerk cleanup error:", e)
    return NextResponse.json({ ok: false, error: 
"Server error" }, { status: 500 })
  }
}
