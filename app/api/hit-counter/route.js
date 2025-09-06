// pages/api/hit-counter.js (or app/api/hit-counter/route.js)
import { getDb } from "@/lib/mongodb"

const INITIAL_COUNT = 6858
const MAX_COUNT = 99000000 // 99 million

export async function POST() {
  const db = await getDb()
  const collection = db.collection("page_hits")

  const result = await collection.findOneAndUpdate(
    { page: "home" },
    [
      {
        $set: {
          total: {
            $cond: {
              if: { $lt: [{ $ifNull: ["$total", INITIAL_COUNT] }, MAX_COUNT] },
              then: { $add: [{ $ifNull: ["$total", INITIAL_COUNT] }, 1] },
              else: "$total"
            }
          }
        }
      }
    ],
    { upsert: true, returnDocument: "after" }
  )

  return Response.json({ total: result.total })
}
