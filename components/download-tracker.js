"use client"

import { useState } from "react"

export function DownloadTracker({ contentId, downloads }) {
  const [downloadCount, setDownloadCount] = useState(downloads)

  const handleDownloadClick = async () => {
    try {
      await fetch(`/api/content/${contentId}/download`, {
        method: "POST",
      })
      setDownloadCount((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to track download:", error)
    }
  }

  return (
    <div className="flex items-center gap-2" onClick={handleDownloadClick}>
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="text-sm text-gray-400">{downloadCount} downloads</span>
    </div>
  )
}
