import { getDb } from "@/lib/mongodb"

export async function POST() {
  const db = await getDb()
  const collection = db.collection("page_hits")

  const result = await collection.findOneAndUpdate(
    { page: "home" },
    { $inc: { total: 1 } },
    { upsert: true, returnDocument: "after" }
  )

  return Response.json({ total: result.total ?? 1 })
}
