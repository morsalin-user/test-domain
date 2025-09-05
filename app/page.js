// app/page.js
import { getDb } from "../lib/mongodb"
import Gallery from "../components/gallery"
import Navbar from "../components/navbar"
import CountdownTimer from "../components/countdown-timer"
import Footer from "../components/footer"
import CategoryFilter from "../components/category-filter"
import Advertisement from "../components/advertisement"
import Instruction from "../components/instruction"
import HitCounter from "../components/hit-counter"


export default async function HomePage() {
  const db = await getDb()

  // Fetch all videos
  const items = await db
    .collection("files")
    .find({ resourceType: "video" })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray()

  const mapped = items.map((i) => ({ ...i, _id: String(i._id) }))

  // Get unique categories for the filter
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))]

  return (
    <>
      <Navbar />
      <CountdownTimer />
      <main className="max-w-7xl mx-auto px-4 py-8 bg-neutral-900">
        <HitCounter />
        <Instruction />
        <CategoryFilter categories={categories} />
        <Gallery items={mapped} />
      </main>
      <Advertisement />
      <Footer />
    </>
  )
}