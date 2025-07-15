"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { showToast } from "@/components/toast"
import { GoogleLogin } from "@/components/google-login"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminPage() {
  const [pendingContent, setPendingContent] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [user])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth")
      if (response.ok) {
        setIsAuthenticated(true)
        loadPendingContent()
      } else if (user && user.isAdmin) {
        setIsAuthenticated(true)
        loadPendingContent()
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDiscordLogin = () => {
    window.location.href = "/api/auth/discord"
  }

  const loadPendingContent = async () => {
    try {
      const response = await fetch("/api/admin/pending")
      if (response.ok) {
        const data = await response.json()
        setPendingContent(data)
      }
    } catch (error) {
      console.error("Failed to load pending content:", error)
    }
  }

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/admin/approve/${id}`, { method: "POST" })
      if (response.ok) {
        showToast("Content approved", "success")
        loadPendingContent()
      }
    } catch (error) {
      showToast("Failed to approve content", "error")
    }
  }

  const handleReject = async (id) => {
    try {
      const response = await fetch(`/api/admin/reject/${id}`, { method: "POST" })
      if (response.ok) {
        showToast("Content rejected", "success")
        loadPendingContent()
      }
    } catch (error) {
      showToast("Failed to reject content", "error")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-purple-100">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="content-card w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h2 className="text-xl font-bold text-purple-100">Admin Login</h2>
            </div>
            <p className="text-gray-300 mb-6">Login with your admin account to access the admin panel.</p>

            <div className="space-y-4">
              <button
                onClick={handleDiscordLogin}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.077.077 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Login with Discord
              </button>

              <GoogleLogin isAdmin={true} onSuccess={() => window.location.reload()} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-purple-100">Pending Content Review</h1>

        {pendingContent.length === 0 ? (
          <div className="content-card text-center py-16">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-purple-100 mb-2">All caught up!</h3>
            <p className="text-gray-400">No pending content to review.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingContent.map((content) => (
              <div key={content._id} className="content-card purple-glow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <span className="badge badge-warning">Pending Review</span>
                  <span className="badge badge-primary">{content.category}</span>
                </div>

                <h3 className="text-xl font-bold text-purple-100 mb-2">{content.title}</h3>
                <p className="text-gray-300 mb-2">
                  by {content.author} • {new Date(content.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-300 mb-4">{content.description}</p>

                <div className="mb-4">
                  <span className="text-purple-200 font-medium">Download Link: </span>
                  <Link
                    href={content.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 break-all"
                  >
                    {content.downloadLink}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleApprove(content._id)} className="btn btn-success">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button onClick={() => handleReject(content._id)} className="btn btn-danger">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                  <Link
                    href={content.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
