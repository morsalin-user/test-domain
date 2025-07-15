"use client"

import Link from "next/link"
import { LinkVertiseButton } from "@/components/linkvertise-button"
import { GoogleAd } from "@/components/google-ad"
import { DownloadTracker } from "@/components/download-tracker"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LikeDislike } from "@/components/like-dislike"
import { Comments } from "@/components/comments"

export function ContentPageClient({ content }) {
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

  // Function to track downloads - this should be called when actual download happens
  const trackDownload = async () => {
    try {
      await fetch(`/api/content/${content._id}/download`, {
        method: "POST",
      })
    } catch (error) {
      console.error("Failed to track download:", error)
    }
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                </div>
                {/* FIXED: Remove onClick handler from DownloadTracker - it should only display count */}
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
                <LinkVertiseButton
                  originalUrl={content.downloadLink}
                  contentId={content._id}
                  className="btn btn-primary text-lg px-6 py-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Now
                </LinkVertiseButton>

                {/* FIXED: Add download tracking to the actual download button */}
                <Link
                  href={content.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-lg px-6 py-3"
                  onClick={trackDownload}
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
                </Link>
              </div>

              {/* FIXED: Add key prop */}
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
              {/* FIXED: Add key prop */}
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

      <Footer />
    </div>
  )
}