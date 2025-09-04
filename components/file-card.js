// components/file-card.js
"use client"
import { useState, useCallback } from "react"
import { useAuth } from "@clerk/nextjs"

export default function FileCard({ item }) {
  const src = item?.mp4Url || item?.secureUrl
  const title = item?.title || "Untitled"
  const description = item?.description || ""
  const category = item?.category || ""

  const { isSignedIn } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)

  const handleDownload = useCallback(async () => {
    if (!item?._id) return
    if (!isSignedIn) {
      setShowLogin(true)
      return
    }

    // Check download limit before attempting download
    try {
      const statsResponse = await fetch('/api/user/download-stats')
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        if (!stats.canDownload) {
          setShowLimitModal(true)
          return
        }
      }
    } catch (error) {
      console.error('Failed to check download stats:', error)
    }

    // Attempt download
    try {
      const response = await fetch(`/api/download/${item._id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 429) {
          // Rate limit exceeded
          setShowLimitModal(true)
          return
        }
        throw new Error(errorData.message || 'Download failed')
      }

      // Get the video blob from response
      const blob = await response.blob()
      
      // Create download link and trigger download
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${title || 'video'}.mp4`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      // Dispatch event to refresh download counter
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('downloadComplete'))
      }, 500)
      
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    }
  }, [isSignedIn, item?._id])

  // Truncate description to 100 characters
  const truncatedDescription = description.length > 70 
    ? description.substring(0, 70) + '...' 
    : description

  return (
    <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 h-full flex flex-col">
      {/* Video section - fixed aspect ratio */}
      <div className="bg-neutral-900 aspect-video max-h-[200px] min-h-[200px]">
        <video className="w-full h-full object-cover" controls playsInline preload="metadata" controlsList="nodownload">
          <source src={src} type="video/mp4" />
          {"Your browser does not support the video tag."}
        </video>
      </div>

      {/* Content section - flex grow to fill remaining space */}
      <div className="p-3 flex flex-col gap-2 flex-grow">
        {/* Title */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-100 text-pretty line-clamp-2">{title}</h3>
        </div>

        {/* Download button and category in same line */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-md bg-amber-600 hover:bg-amber-500 text-neutral-900 font-medium px-3 py-2 transition-colors flex-shrink-0"
            aria-label="Download video"
            title="Download video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1.002 1.002 0 0 1-1.414 0l-4-4A1 1 0 0 1 8.707 10.293L11 12.586V4a1 1 0 0 1 1-1z" />
              <path d="M5 19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a1 1 0 1 0-2 0v2H7v-2a1 1 0 0 0-2 0v2z" />
            </svg>
            <span className="text-sm">Download</span>
          </button>

          {category && (
            <span className="shrink-0 rounded-md bg-neutral-800 text-neutral-300 px-2 py-0.5 text-xs">
              {category}
            </span>
          )}
        </div>

        {/* Description at bottom - truncated to 100 chars */}
        {truncatedDescription && (
          <div className="mt-auto pt-1">
            <p className="text-sm text-neutral-300 leading-5">{truncatedDescription}</p>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLogin ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            aria-label="Close login modal"
            onClick={() => setShowLogin(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative mx-4 w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-lg"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-100 text-balance">Login to download any video</h3>
            <p className="mb-4 text-sm text-neutral-300">
              You must be signed in to download videos. Please sign in to continue.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Sign in
              </a>
              <button
                onClick={() => setShowLogin(false)}
                className="inline-flex items-center justify-center rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Download Limit Modal */}
      {showLimitModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            aria-label="Close limit modal"
            onClick={() => setShowLimitModal(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative mx-4 w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-lg"
          >
            <h3 className="mb-2 text-lg font-semibold text-red-400 text-balance">Download Limit Reached</h3>
            <p className="mb-4 text-sm text-neutral-300">
              You've reached your daily download limit of 5 videos. The limit resets at midnight.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLimitModal(false)}
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}