// components/gallery.js
"use client"
import { useState } from "react"
import FileCard from "./file-card"
import DownloadCounter from "./download-counter"

export default function Gallery({ items = [], initialCount = 12 }) {
  const [expanded, setExpanded] = useState(false)
  
  const visible = expanded ? items : items.slice(0, initialCount)
  const hasMore = items.length > initialCount

  // Fallback items when no videos are found
  const fallbackItems = items.length === 0
    ? Array.from({ length: 6 }, (_, i) => ({
        _id: `placeholder-${i}`,
        secureUrl: "/video1.mp4",
        publicId: `fallback-${i}`,
        category: "other",
        title: "Sample Video",
        fallback: true,
      }))
    : []

  return (
    <section className="w-full">
      {/* Download Counter */}
      <DownloadCounter />

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-neutral-400 mb-4">
            <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-300 mb-2">No videos found</h3>
          <p className="text-neutral-500">Try browsing other categories or check back later.</p>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
        {(items.length === 0 ? fallbackItems : visible).map((item) => (
          <FileCard key={item._id} item={item} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show Less" : `Load More (${items.length - initialCount} remaining)`}
          </button>
        </div>
      )}
    </section>
  )
}