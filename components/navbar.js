"use client"

import Link from "next/link"
import { useAuth, useUser, useClerk } from "@clerk/nextjs"

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "31kua@powerscrews.com"
  const isAdmin = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === adminEmail.toLowerCase()

  async function handleLogout() {
    try {
      // Best-effort cleanup if an OTP signup was not completed
      const pending = typeof window !== "undefined" ? localStorage.getItem("pendingSignupEmail") : null
      if (pending) {
        await fetch("/api/clerk/cleanup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: pending }),
        }).catch(() => {})
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingSignupEmail")
        localStorage.removeItem("pendingSignupStartedAt")
      }
    } finally {
      await signOut()
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-neutral-900 backdrop-blur border-border">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-wide text-white">
          AiVideoReply
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-foreground/80 hover:text-primary transition">
            Home
          </Link>
          <Link href="/videos" className="text-foreground/80 hover:text-primary transition">
            Videos
          </Link>
          {isSignedIn && (
            <Link href="/dashboard" className="text-foreground/80 hover:text-primary transition">
              Dashboard
            </Link>
          )}
          {isSignedIn && isAdmin && (
            <Link
              href="/admin"
              className="rounded bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:opacity-90 transition"
            >
              Admin
            </Link>
          )}
          {!isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="rounded border px-3 py-1.5 text-sm text-primary border-primary hover:bg-primary/10 transition"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded border px-3 py-1.5 text-sm text-foreground border-border hover:bg-foreground/5 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
