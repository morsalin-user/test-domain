"use server"

import { getDb } from "../lib/mongodb"
import Gallery from "../components/gallery"
import Navbar from "../components/navbar"

import Footer from "../components/footer"

export default async function HomePage() {
  const db = await getDb()
  const items = await db
    .collection("files")
    .find({ resourceType: "video" })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray()

  const mapped = items.map((i) => ({ ...i, _id: String(i._id) }))

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 bg-neutral-900">
        <Gallery items={mapped} />
      </main>
      <Footer />
    </>
  )
}
