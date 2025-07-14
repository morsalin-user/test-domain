import Link from "next/link"
import { getContentById } from "@/lib/content"
import { notFound } from "next/navigation"
// import { LinkVertiseButton } from "@/components/linkvertise-button"
import { GoogleAd } from "@/components/google-ad"

export default async function ContentPage({ params }) {
  const content = await getContentById(params.id)

  if (!content) {
    notFound()
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              AuraVerse
            </div>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/browse" className="btn btn-ghost text-sm md:text-base">
              Browse
            </Link>
            <Link href="/upload" className="btn btn-primary text-sm md:text-base">
              Upload
            </Link>
          </div>
        </div>
      </nav>

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
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>{content.downloads || 0} downloads</span>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">{content.description}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={content.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
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
                </a>


                <Link
                  href={content.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-lg px-6 py-3"
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
            </div>

            {/* Google Ad */}
            <GoogleAd
              slot="4444444444"
              style={{ display: "block" }}
              format="auto"
              responsive="true"
              className="ad-container"
            />

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
    </div>
  )
}
