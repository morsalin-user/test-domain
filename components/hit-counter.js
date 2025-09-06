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

  // Format number with leading zeros
  const formatCount = (num) => {
    if (num === null || num === undefined) return "00000000"
    return num.toString().padStart(8, "0")
  }

  const digits = formatCount(count).split("")

  return (
    <section className="w-full mb-8 mt-8">
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 text-center">
        <div className="flex justify-center space-x-1">
          {digits.map((digit, idx) => (
            <div
              key={idx}
              className="text-black bg-amber-500 font-mono font-bold text-2xl w-15 h-14 flex items-center justify-center rounded-md shadow-md"
            >
              {digit}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

