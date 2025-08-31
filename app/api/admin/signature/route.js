import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import cloudinary from "cloudinary"

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function POST() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || ""
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
  if ((email || "").toLowerCase() !== adminEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = "aivideo" // adjust if you want
  const paramsToSign = { timestamp, folder, resource_type: "video" }
  const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET)

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    signature,
    timestamp,
    folder,
  })
}
