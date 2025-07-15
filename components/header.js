"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import { AdminNavLink } from "./admin-nav-link"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, setUser } = useAuth()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="border-b border-purple-500/20 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              AuraVerse
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
          <Link href="/" className="btn btn-ghost">
              Home
            </Link>
            <Link href="/browse" className="btn btn-ghost">
              Browse
            </Link>
            <Link href="/requests" className="btn btn-ghost">
              Requests
            </Link>
            <AdminNavLink />
            <Link href="/upload" className="btn btn-primary">
              Upload
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user.picture && (
                    <img src={user.picture || "/placeholder.svg"} alt="Profile" className="w-8 h-8 rounded-full" />
                  )}
                  <span className="text-purple-300 text-sm">{user.username || user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/upload" className="btn btn-secondary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-purple-400">
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-purple-500/20">
            <div className="flex flex-col gap-2 pt-4">
            <Link href="/" className="btn btn-ghost w-full justify-start">
                Home
              </Link>
              <Link href="/browse" className="btn btn-ghost w-full justify-start">
                Browse
              </Link>
              <Link href="/requests" className="btn btn-ghost w-full justify-start">
                Requests
              </Link>
              <AdminNavLink />
              <Link href="/upload" className="btn btn-primary w-full justify-start">
                Upload
              </Link>
              {user ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-purple-500/20">
                  <div className="flex items-center gap-2 px-3 py-2">
                    {user.picture && (
                      <img src={user.picture || "/placeholder.svg"} alt="Profile" className="w-8 h-8 rounded-full" />
                    )}
                    <span className="text-purple-300 text-sm">{user.username || user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-ghost w-full justify-start">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/upload" className="btn btn-secondary w-full justify-start">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
