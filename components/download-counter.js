// components/download-counter.js
"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"

export default function DownloadCounter() {
  const { isSignedIn, userId } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSignedIn || !userId) {
      setLoading(false)
      return
    }

    fetchStats()
  }, [isSignedIn, userId])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/download-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch download stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Refresh stats when downloads happen
  useEffect(() => {
    const handleDownload = () => {
      setTimeout(fetchStats, 1000) // Refresh after 1 second
    }

    window.addEventListener('downloadComplete', handleDownload)
    return () => window.removeEventListener('downloadComplete', handleDownload)
  }, [])

  if (!isSignedIn) {
    return (
      <div className="bg-neutral-800 rounded-lg p-4 mb-6">
        <p className="text-neutral-300 text-center">
          Sign in to download videos
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-neutral-800 rounded-lg p-4 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-700 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const { downloaded, remaining, limit } = stats

  return (
    <div className="bg-neutral-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">{downloaded}</div>
            <div className="text-xs text-neutral-400">Downloaded Today</div>
          </div>
          
          <div className="text-neutral-600">/</div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-300">{limit}</div>
            <div className="text-xs text-neutral-400">Daily Limit</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-semibold text-green-500">{remaining}</div>
          <div className="text-xs text-neutral-400">Remaining</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3">
        <div className="w-full bg-neutral-700 rounded-full h-2">
          <div 
            className="bg-amber-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(downloaded / limit) * 100}%` }}
          ></div>
        </div>
        <div className="mt-1 text-xs text-neutral-400 text-center">
          {remaining > 0 
            ? `You can download ${remaining} more video${remaining === 1 ? '' : 's'} today`
            : 'Daily download limit reached. Resets at midnight.'
          }
        </div>
      </div>
    </div>
  )
}