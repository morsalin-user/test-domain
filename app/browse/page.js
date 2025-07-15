
export const dynamic = 'force-dynamic';

import { getApprovedContent } from "@/lib/content"
import { GoogleAd } from "@/components/google-ad"
import { DownloadTracker } from "@/components/download-tracker"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default async function BrowsePage() {
  const content = await getApprovedContent()

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-100">Browse Content</h1>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input type="text" placeholder="Search for plugins, servers, mods..." className="input pl-10" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select className="select">
                    <option value="">All Categories</option>
                    <option value="plugins">Plugins</option>
                    <option value="servers">Server Setups</option>
                    <option value="mods">Mods</option>
                    <option value="maps">Maps</option>
                    <option value="textures">Texture Packs</option>
                    <option value="other">Other</option>
                  </select>
                  <select className="select">
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Google Ad */}
            <GoogleAd
              slot="1111111111"
              style={{ display: "block" }}
              format="auto"
              responsive="true"
              className="ad-container mb-8"
            />

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {content.map((item) => (
                <div key={item._id} className="content-card hover:purple-glow transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-primary">{item.category}</span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-purple-100 mb-2">{item.title}</h3>
                  <p className="text-gray-300 mb-4 text-sm">{item.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>by {item.author}</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <DownloadTracker contentId={item._id} downloads={item.downloads || 0} />
                    <Link href={`/content/${item._id}`} className="btn btn-primary text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {content.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold text-purple-100 mb-2">No content yet</h3>
                <p className="text-gray-400 mb-6">Be the first to share something amazing!</p>
                <Link href="/upload" className="btn btn-primary">
                  Upload Content
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar Ads */}
          <div className="hidden lg:block w-80">
            <div className="ad-sidebar">
              <GoogleAd
                slot="2222222222"
                style={{ display: "block", width: "300px", height: "600px" }}
                className="ad-banner mb-8"
              />
              <GoogleAd
                slot="3333333333"
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
