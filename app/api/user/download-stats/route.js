// app/api/user/download-stats/route.js
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getDb } from "../../../../lib/mongodb"

export const runtime = "nodejs"

export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db = await getDb()
  
  // Get today's date range
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Start of today
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1) // Start of tomorrow
  
  // Count today's downloads
  const todayDownloads = await db.collection("downloads").countDocuments({
    userId,
    at: {
      $gte: today,
      $lt: tomorrow
    }
  })
  
  const remainingDownloads = Math.max(0, 5 - todayDownloads)
  
  return NextResponse.json({
    downloaded: todayDownloads,
    remaining: remainingDownloads,
    limit: 5,
    canDownload: remainingDownloads > 0
  })
}