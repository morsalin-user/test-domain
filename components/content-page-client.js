"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { LinkVertiseButton } from "@/components/linkvertise-button"
import { GoogleAd } from "@/components/google-ad"
import { DownloadTracker } from "@/components/download-tracker"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LikeDislike } from "@/components/like-dislike"
import { Comments } from "@/components/comments"

export function ContentPageClient({ content }) {
  const [showAdModal, setShowAdModal] = useState(false)
  const [countdown, setCountdown] = useState(10) // 10 seconds countdown
  const [canDownload, setCanDownload] = useState(false)

  const renderMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-purple-900/30 px-1 rounded">$1</code>')
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-purple-400 hover:text-purple-300">$1</a>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-purple-100 mt-4 mb-2">$1</h2>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, "<br>")
  }

  // Function to track downloads
  const trackDownload = async () => {
    try {
      await fetch(`/api/content/${content._id}/download`, {
        method: "POST",
      })
    } catch (error) {
      console.error("Failed to track download:", error)
    }
  }

  // Handle download button click
  const handleDownloadClick = (e) => {
    e.preventDefault()
    setShowAdModal(true)
    setCountdown(10) // Reset countdown
    setCanDownload(false)
  }

  // Handle direct link click
  const handleDirectLinkClick = (e) => {
    e.preventDefault()
    setShowAdModal(true)
    setCountdown(5) // Shorter countdown for direct link
    setCanDownload(false)
  }

  // Countdown timer effect
  useEffect(() => {
    let timer
    if (showAdModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanDownload(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [showAdModal, countdown])

  // Handle actual download
  const proceedToDownload = async () => {
    await trackDownload()
    setShowAdModal(false)
    
    // For the main download button (Linkvertise)
    if (countdown === 0) {
      window.open(`https://linkvertise.com/1371134/${encodeURIComponent("https://raw.githubusercontent.com/LakshyaTheMinecrafter/Share-Files/main/catppuccindactyl-v10.zip")}`, '_blank')
    }
  }

  // Handle direct link download
  const proceedToDirectDownload = async () => {
    await trackDownload()
    setShowAdModal(false)
    window.open(content.downloadLink, '_blank')
  }

  // Close modal
  const closeModal = () => {
    setShowAdModal(false)
    setCountdown(10)
    setCanDownload(false)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="content-card purple-glow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <span className="badge badge-primary">{content.category}</span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>4.8</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-purple-100 mb-4">{content.title}</h1>

              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>by {content.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                </div>
                <DownloadTracker
                  contentId={content._id}
                  downloads={content.downloads || 0}
                />
              </div>

              <div
                className="text-gray-300 text-lg leading-relaxed mb-8 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content.description) }}
              />

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleDownloadClick}
                  className="btn btn-primary text-lg px-6 py-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Now
                </button>

                <button
                  onClick={handleDirectLinkClick}
                  className="btn btn-secondary text-lg px-6 py-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Direct Link
                </button>
              </div>

              <LikeDislike contentId={content._id} type="content" />
            </div>

            {/* Google Ad */}
            <GoogleAd
              slot="4444444444"
              style={{ display: "block" }}
              format="auto"
              responsive="true"
              className="ad-container"
            />

            {/* Comments Section */}
            <div className="content-card purple-glow">
              <Comments contentId={content._id} type="content" />
            </div>

            <div className="mt-8 text-center">
              <Link href="/browse" className="btn btn-ghost">
                ← Back to Browse
              </Link>
            </div>
          </div>

          {/* Sidebar Ads */}
          <div className="hidden lg:block w-80">
            <div className="ad-sidebar">
              <GoogleAd
                slot="5555555555"
                style={{ display: "block", width: "300px", height: "600px" }}
                className="ad-banner mb-8"
              />
              <GoogleAd
                slot="6666666666"
                style={{ display: "block", width: "300px", height: "250px" }}
                className="ad-banner"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="mb-4">
                <svg className="w-12 h-12 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Preparing your download...
                </h3>
                <p className="text-gray-400 text-sm">
                  Please wait while we prepare your file. This helps us keep the platform free!
                </p>
              </div>

              {/* Ad Space */}
              <div className="bg-gray-800 rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center">
                <GoogleAd
                  slot="7777777777"
                  style={{ display: "block", width: "300px", height: "250px" }}
                  className="ad-banner"
                />
              </div>

              {/* Countdown */}
              <div className="mb-4">
                {countdown > 0 ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                    <span className="text-gray-300">
                      Download will be ready in {countdown} seconds...
                    </span>
                  </div>
                ) : (
                  <div className="text-green-400 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ready to download!</span>
                  </div>
                )}
              </div>

              {/* Download Button */}
              <div className="flex gap-2">
                <button
                  onClick={proceedToDownload}
                  disabled={!canDownload}
                  className={`btn flex-1 ${
                    canDownload 
                      ? 'btn-primary hover:bg-purple-700' 
                      : 'btn-disabled bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {canDownload ? 'Download Now' : `Wait ${countdown}s`}
                </button>
                
                {/* Show direct download option if it was clicked */}
                {countdown === 0 && (
                  <button
                    onClick={proceedToDirectDownload}
                    className="btn btn-secondary"
                  >
                    Direct Link
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Thanks for supporting our free platform! 🎉
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
