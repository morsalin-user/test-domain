// app/category/[slug]/page.js (Enhanced version with breadcrumb)
"use server"

import { getDb } from "../../../lib/mongodb"
import Gallery from "../../../components/gallery"
import Navbar from "../../../components/navbar"
import CountdownTimer from "../../../components/countdown-timer"
import Footer from "../../../components/footer"
import CategoryFilter from "../../../components/category-filter"
import Breadcrumb from "../../../components/breadcrumb"
import { notFound } from "next/navigation"
import Advertisement from "@/components/advertisement"

export default async function CategoryPage({ params }) {
  const { slug } = params
  
  const db = await getDb()
  
  // Get all categories first to check if the slug is valid
  const allItems = await db
    .collection("files")
    .find({ resourceType: "video" })
    .toArray()
  
  const allCategories = [...new Set(allItems.map(item => item.category).filter(Boolean))]
  
  // Check if category exists
  if (!allCategories.includes(slug)) {
    notFound()
  }
  
  // Fetch items for this specific category
  const items = await db
    .collection("files")
    .find({ 
      resourceType: "video",
      category: slug 
    })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray()

  const mapped = items.map((i) => ({ ...i, _id: String(i._id) }))

  return (
    <>
      <Navbar />
      <CountdownTimer />
      <main className="max-w-7xl mx-auto px-4 py-8 bg-neutral-900">
        <Breadcrumb />
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2 capitalize">
            {slug} Videos
          </h1>
          <p className="text-neutral-400">
            {mapped.length} video{mapped.length !== 1 ? 's' : ''} available in this category
          </p>
        </div>
        
        <CategoryFilter categories={allCategories} currentCategory={slug} />
        <Gallery items={mapped} />
        
        {mapped.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500 mb-4">
              No videos found in the "{slug}" category yet.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-medium transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        )}
        <Advertisement />
      </main>
      <Footer />
    </>
  )
}

// Generate metadata for better SEO
export async function generateMetadata({ params }) {
  const { slug } = params
  
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Videos | Media Vault`,
    description: `Browse and download ${slug} videos from our collection.`,
  }
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  const db = await getDb()
  const items = await db
    .collection("files")
    .find({ resourceType: "video" })
    .toArray()
  
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))]
  
  return categories.map((category) => ({
    slug: category,
  }))
}