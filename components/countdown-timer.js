"use client"

import { useState, useEffect } from "react"

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Set the target date to 30 days from now (or you can set a specific end date)
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 30)
    
    // Store the target date in localStorage on first visit
    let storedTargetDate = localStorage.getItem('countdownTarget')
    if (!storedTargetDate) {
      localStorage.setItem('countdownTarget', targetDate.toISOString())
      storedTargetDate = targetDate.toISOString()
    }
    
    const endDate = new Date(storedTargetDate)

    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = endDate.getTime() - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        // Timer reached zero, remove from localStorage
        localStorage.removeItem('countdownTarget')
        setTimeLeft(null)
      }
    }

    // Update immediately
    updateTimer()

    // Update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  // Don't render on server side to avoid hydration mismatch
  if (!isClient || !timeLeft) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-black py-3">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-1 text-lg font-bold">
          <span className="text-sm font-medium mr-2">Special Offer Ends In:</span>
          <div className="flex items-center space-x-1">
            <span className="bg-black text-amber-500 px-2 py-1 rounded text-sm font-mono">
              {timeLeft.days}d
            </span>
            <span className="bg-black text-amber-500 px-2 py-1 rounded text-sm font-mono">
              {timeLeft.hours}h
            </span>
            <span className="bg-black text-amber-500 px-2 py-1 rounded text-sm font-mono">
              {timeLeft.minutes}m
            </span>
            <span className="bg-black text-amber-500 px-2 py-1 rounded text-sm font-mono">
              {timeLeft.seconds}s
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}