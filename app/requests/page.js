"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { showToast } from "@/components/toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarkdownEditor } from "@/components/markdown-editor"
import { LikeDislike } from "@/components/like-dislike"
import { Comments } from "@/components/comments"
import { GoogleLogin } from "@/components/google-login"

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    isPaid: false,
  })
  const { user } = useAuth()

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const response = await fetch("/api/requests")
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Failed to load requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showToast("Request submitted successfully!", "success")
        setShowForm(false)
        setFormData({
          title: "",
          description: "",
          category: "",
          price: "",
          isPaid: false,
        })
        loadRequests()
      }
    } catch (error) {
      showToast("Failed to submit request", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDiscordLogin = () => {
    window.location.href = "/api/auth/discord"
  }

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

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-purple-100 mb-2">Resource Requests</h1>
            <p className="text-gray-300">Request resources from the community or browse existing requests</p>
          </div>
          <button onClick={() => (user ? setShowForm(!showForm) : setShowLoginModal(true))} className="btn btn-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </button>
        </div>

        {/* Request Form */}
        {showForm && (
          <div className="content-card purple-glow mb-8">
            <h2 className="text-xl font-bold text-purple-100 mb-4">Submit a Resource Request</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-purple-200 mb-2">
                  Resource Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="What resource are you looking for?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <option value="mods">Builds</option>
                  <option value="maps">Configs</option>
                  <option value="textures">Models</option>
                  <option value="other">Server jars</option>
                  <option value="other">Skripts</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-purple-200 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.isPaid}
                    onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-purple-500 rounded focus:ring-purple-500"
                  />
                  This is a paid request
                </label>

                {formData.isPaid && (
                  <div>
                    <label htmlFor="price" className="block text-purple-200 mb-2">
                      Budget/Price
                    </label>
                    <input
                      id="price"
                      type="text"
                      placeholder="e.g., $50, €30, or negotiable"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-purple-200 mb-2">
                  Description (Markdown supported)
                </label>
                <MarkdownEditor
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  placeholder="Describe what you're looking for, specific requirements, features needed, etc."
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-purple-100">Loading requests...</div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-purple-100 mb-2">No requests yet</h3>
            <p className="text-gray-400 mb-6">Be the first to request a resource!</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Submit Request
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request._id} className="content-card purple-glow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-primary">{request.category}</span>
                    {request.isPaid && <span className="badge badge-warning">Paid</span>}
                    <span className="badge badge-success">Open</span>
                  </div>
                  <div className="text-sm text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</div>
                </div>

                <h3 className="text-xl font-bold text-purple-100 mb-2">{request.title}</h3>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    {request.author.picture && (
                      <img
                        src={request.author.picture || "/placeholder.svg"}
                        alt={request.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>by {request.author.name}</span>
                  </div>
                  {request.isPaid && request.price && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span>{request.price}</span>
                    </div>
                  )}
                </div>

                <div
                  className="text-gray-300 mb-6 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(request.description) }}
                />

                <div className="flex items-center justify-between mb-4">
                  <LikeDislike contentId={request._id} type="requests" />
                  <button className="btn btn-secondary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Respond
                  </button>
                </div>

                <Comments contentId={request._id} type="requests" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="content-card max-w-md w-full">
            <h3 className="text-xl font-bold text-purple-100 mb-4">Login Required</h3>
            <p className="text-gray-300 mb-6">You need to login to submit a request.</p>

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

              <GoogleLogin onSuccess={() => setShowLoginModal(false)} />
            </div>

            <button onClick={() => setShowLoginModal(false)} className="btn btn-ghost w-full mt-4">
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
