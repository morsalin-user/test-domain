// components/gallery.js
"use client"
import { useMemo, useState } from "react"
import FileCard from "./file-card"
import DownloadCounter from "./download-counter"

export default function Gallery({ items = [], initialCount = 8, selectedCategory = "all" }) {
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(() => {
    if (!items?.length) return []
    if (!selectedCategory || selectedCategory === "all") return items
    return items.filter((i) => i.category === selectedCategory)
  }, [items, selectedCategory])

  const visible = expanded ? filtered : filtered.slice(0, initialCount)
  const isEmpty = filtered.length === 0

  // Custom Video Icon Component
  const VideoIcon = () => (
    <svg 
      className="w-16 h-16 text-neutral-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
      />
    </svg>
  )

  // Empty State Component
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-neutral-800/50 rounded-full">
          <VideoIcon />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-neutral-200 mb-2">
            No Videos Available
          </h3>
          <p className="text-neutral-400 text-sm max-w-md">
            {selectedCategory === "all" 
              ? "There are currently no videos in the gallery. Check back later for new content."
              : `No videos found in the "${selectedCategory}" category. Try selecting a different category.`
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 text-xs text-neutral-500">
          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse"></div>
          <span>Videos will appear here when available</span>
        </div>
      </div>
    </div>
  )

  return (
    <section className="w-full">
      {/* Download Counter */}
      <DownloadCounter />

      {/* Gallery Grid or Empty State */}
      {isEmpty ? (
        <div className="w-full min-h-[400px] bg-neutral-900/30 rounded-lg border border-neutral-800">
          <EmptyState />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {visible.map((item) => (
              <FileCard key={item._id} item={item} />
            ))}
          </div>

          {filtered.length > initialCount && (
            <div className="flex justify-center mt-8">
              <button
                className="px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "View less" : "View more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}