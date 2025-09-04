"use client"
import { useEffect, useMemo, useState } from "react"

export default function Countdown31Days() {
  const endAt = useMemo(() => Date.now() + 31 * 24 * 60 * 60 * 1000, [])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = Math.max(0, endAt - now)
  const d = Math.floor(diff / (24 * 60 * 60 * 1000))
  const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
  const s = Math.floor((diff % (60 * 1000)) / 1000)

  return (
    <div className="w-full bg-neutral-900 border-b border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-2 text-neutral-200">
        <span className="font-medium text-amber-400">
          {d}d {h}h {m}m {s}s
        </span>
      </div>
    </div>
  )
}
