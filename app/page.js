import Link from "next/link"
import { getLatestContent } from "@/lib/content"
import { GoogleAd } from "@/components/google-ad"

export default async function HomePage() {
  const latestContent = await getLatestContent()

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            AuraVerse
          </div>
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
            Share. Download. Create.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed px-4">
            The ultimate platform for sharing Minecraft content, plugins, and digital resources. Everything is free,
            verified, and ready to enhance your gaming experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/browse" className="btn btn-primary text-lg px-6 py-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Start Downloading
            </Link>
            <Link href="/upload" className="btn btn-secondary text-lg px-6 py-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Share Content
            </Link>
          </div>
        </div>
      </section>

      {/* Google Ad Banner */}
      <GoogleAd
        slot="1234567890"
        style={{ display: "block" }}
        format="auto"
        responsive="true"
        className="ad-container"
      />

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="content-card purple-glow">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-purple-400 mb-4 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 className="text-xl font-bold text-purple-100 mb-2">Verified Content</h3>
              <p className="text-gray-300">
                Every upload is manually reviewed by our team to ensure quality and safety.
              </p>
            </div>
          </div>

          <div className="content-card purple-glow">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-purple-400 mb-4 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-bold text-purple-100 mb-2">Lightning Fast</h3>
              <p className="text-gray-300">
                Direct download links from trusted sources like MediaFire, MEGA, and GoFile.
              </p>
            </div>
          </div>

          <div className="content-card purple-glow">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-purple-400 mb-4 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-xl font-bold text-purple-100 mb-2">Community Driven</h3>
              <p className="text-gray-300">Built by the community, for the community. Everything is free and open.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Content */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-100">Latest Content</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestContent.map((content) => (
            <div key={content._id} className="content-card hover:purple-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-primary">{content.category}</span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-sm">4.8</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-purple-100 mb-2">{content.title}</h3>
              <p className="text-gray-300 mb-4 text-sm line-clamp-3">{content.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">by {content.author}</span>
                <Link href={`/content/${content._id}`} className="btn btn-primary text-sm">
                  Download
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Google Ad Banner */}
      <GoogleAd
        slot="0987654321"
        style={{ display: "block" }}
        format="auto"
        responsive="true"
        className="ad-container"
      />

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
              AuraVerse
            </div>
            <p className="text-gray-400">Empowering creators, one download at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
