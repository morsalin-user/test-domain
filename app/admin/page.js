"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { showToast } from "@/components/toast"

export default function AdminPage() {
  const [pendingContent, setPendingContent] = useState([])
  const [adminEmail, setAdminEmail] = useState("")
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

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        loadPendingContent()
        showToast("Logged in successfully", "success")
      } else {
        showToast("Invalid admin email", "error")
      }
    } catch (error) {
      showToast("Login failed", "error")
    }
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
      <div className="min-h-screen gradient-bg flex items-center justify-center">
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
          <p className="text-gray-300 mb-6">Enter your admin email to access the admin panel.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-purple-200 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
        </div>
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
              AuraVerse Admin
            </div>
          </Link>
          <span className="badge badge-primary">Admin Panel</span>
        </div>
      </nav>

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
    </div>
  )
}
