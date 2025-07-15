"use client"

import { useState } from "react"

export function LinkVertiseButton({ originalUrl, contentId, children, className }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Track download
      if (contentId) {
        await fetch(`/api/content/${contentId}/download`, {
          method: "POST",
        })
      }

      const response = await fetch("/api/linkvertise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: originalUrl }),
      })

      const data = await response.json()
      window.open(data.shortenedUrl, "_blank")
    } catch (error) {
      console.error("LinkVertise error:", error)
      window.open(originalUrl, "_blank")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={isLoading} className={className}>
      {isLoading ? "Generating link..." : children}
    </button>
  )
}
