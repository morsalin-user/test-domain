import { connectDB } from "./mongodb"
import Content from "@/models/Content"

export async function getApprovedContent() {
  try {
    await connectDB()
    const content = await Content.find({ status: "approved" }).sort({ createdAt: -1 }).lean()
    return JSON.parse(JSON.stringify(content))
  } catch (error) {
    console.error("Error fetching approved content:", error)
    return []
  }
}

export async function getLatestContent(limit = 6) {
  try {
    await connectDB()
    const content = await Content.find({ status: "approved" }).sort({ createdAt: -1 }).limit(limit).lean()
    return JSON.parse(JSON.stringify(content))
  } catch (error) {
    console.error("Error fetching latest content:", error)
    return []
  }
}

export async function getContentById(id) {
  try {
    await connectDB()
    const content = await Content.findOne({ _id: id, status: "approved" }).lean()
    return content ? JSON.parse(JSON.stringify(content)) : null
  } catch (error) {
    console.error("Error fetching content by ID:", error)
    return null
  }
}
