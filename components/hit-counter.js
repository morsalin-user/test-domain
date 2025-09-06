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
        <div className="flex justify-center space-x-2">
          {digits.map((digit, idx) => (
            <div
              key={idx}
              className="w-10 h-14 sm:w-12 sm:h-16 flex items-center justify-center 
                         bg-neutral-800 border border-neutral-700 rounded-md 
                         text-2xl sm:text-3xl font-bold text-amber-400 
                         shadow-md shadow-amber-600/10"
            >
              {digit}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
