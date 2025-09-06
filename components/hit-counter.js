// components/hit-counter.js
"use client"

import { useEffect, useState } from "react"

export default function HitCounter() {
  const [count, setCount] = useState(null)

  useEffect(() => {
    async function updateHits() {
      try {
        const res = await fetch("/api/hit-counter", { method: "POST" })
        const data = await res.json()
        setCount(data.total)
      } catch (err) {
        console.error("Failed to update hit counter", err)
      }
    }
    updateHits()
  }, [])

  // Format number with leading zeros for display
  const formatCount = (num) => {
    if (num === null || num === undefined) return "…"
    return num.toString().padStart(8, "0")
  }

  return (
    <section className="w-full mb-8 mt-8">
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 text-center">
        <span className="text-4xl md:text-5xl font-bold text-amber-400 tracking-widest">
          {formatCount(count)}
        </span>
      </div>
    </section>
  )
}
