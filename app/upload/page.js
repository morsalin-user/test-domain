"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { showToast } from "@/components/toast"

export default function UploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    downloadLink: "",
    author: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true)
    }
  }, [user, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showToast("Content submitted for review!", "success")
        router.push("/browse")
      } else {
        throw new Error("Failed to submit content")
      }
    } catch (error) {
      showToast("Failed to submit content. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValidLink = (url) => {
    const allowedDomains = ["mediafire.com", "mega.nz", "gofile.io"]
    try {
      const urlObj = new URL(url)
      return allowedDomains.some((domain) => urlObj.hostname.includes(domain))
    } catch {
      return false
    }
  }

  const handleDiscordLogin = () => {
    window.location.href = "/api/auth/discord"
  }

  const handleEmailLogin = async (email) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        showToast("Logged in successfully", "success")
        setShowLoginModal(false)
        window.location.reload()
      } else {
        showToast("Invalid admin email", "error")
      }
    } catch (error) {
      showToast("Login failed", "error")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-purple-100">Loading...</div>
      </div>
    )
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
            {user && <span className="text-purple-300 text-sm">Welcome, {user.username}</span>}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-purple-100">Share Your Content</h1>
          <p className="text-gray-300">
            Upload your Minecraft content and share it with the community. All submissions are reviewed before going
            live.
          </p>
        </div>

        <div className="content-card purple-glow">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h2 className="text-xl font-bold text-purple-100">Upload Content</h2>
          </div>
          <p className="text-gray-300 mb-6">Fill out the form below to submit your content for review.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-purple-200 mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a descriptive title for your content"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-purple-200 mb-2">
                Author Name
              </label>
              <input
                id="author"
                type="text"
                placeholder="Your name or username"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-purple-200 mb-2">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="select"
                required
              >
                <option value="">Select a category</option>
                <option value="plugins">Plugins</option>
                <option value="servers">Server Setups</option>
                <option value="mods">Mods</option>
                <option value="maps">Maps</option>
                <option value="textures">Texture Packs</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-purple-200 mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Describe your content, what it does, how to install it, etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="textarea"
                required
              />
            </div>

            <div>
              <label htmlFor="downloadLink" className="block text-purple-200 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Download Link
              </label>
              <input
                id="downloadLink"
                type="url"
                placeholder="https://mediafire.com/... or https://mega.nz/... or https://gofile.io/..."
                value={formData.downloadLink}
                onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                className="input"
                required
              />
              <div className="alert alert-info mt-2">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Only links from MediaFire, MEGA, and GoFile.io are allowed.
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting || !isValidLink(formData.downloadLink)}
            >
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </button>
          </form>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="content-card max-w-md w-full">
            <h3 className="text-xl font-bold text-purple-100 mb-4">Login Required</h3>
            <p className="text-gray-300 mb-6">You need to login to upload content.</p>

            <div className="space-y-4">
              <button
                onClick={handleDiscordLogin}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Login with Discord
              </button>

              <div className="text-center text-gray-400">or</div>

              <div>
                <input
                  type="email"
                  placeholder="Admin email (for testing)"
                  className="input mb-2"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleEmailLogin(e.target.value)
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const email = e.target.previousElementSibling.value
                    handleEmailLogin(email)
                  }}
                  className="btn btn-secondary w-full"
                >
                  Login with Email
                </button>
              </div>
            </div>

            <button onClick={() => setShowLoginModal(false)} className="btn btn-ghost w-full mt-4">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
