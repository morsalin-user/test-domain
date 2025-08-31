"use client"
import { useMemo, useState } from "react"
import FileCard from "./file-card"

export default function Gallery({ items = [], initialCount = 8, selectedCategory = "all" }) {
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(() => {
    if (!items?.length) return []
    if (!selectedCategory || selectedCategory === "all") return items
    return items.filter((i) => i.category === selectedCategory)
  }, [items, selectedCategory])

  const visible = expanded ? filtered : filtered.slice(0, initialCount)

  const isEmpty = filtered.length === 0

  const fallbackItems = isEmpty
    ? Array.from({ length: 10 }, (_, i) => ({
        _id: `placeholder-${i}`,
        secureUrl: "/video1.mp4",
        publicId: `fallback-${i}`,
        category: "other",
        fallback: true, // flag to identify
      }))
    : []

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
        {(isEmpty ? fallbackItems : visible).map((item) => (
          <FileCard key={item._id} item={item} />
        ))}
      </div>

      {!isEmpty && filtered.length > initialCount && (
        <div className="flex justify-center mt-8">
          <button
            className="px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "View less" : "View more"}
          </button>
        </div>
      )}
    </section>
  )
}
