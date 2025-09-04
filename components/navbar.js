"use client"
import { useState } from "react"
import Link from "next/link"
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useUser()
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
  const isAdmin = (user?.primaryEmailAddress?.emailAddress || "").toLowerCase() === adminEmail

  return (
    <header className="w-full bg-neutral-900 text-neutral-100 border-b border-neutral-800">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide">
          AiVideoReply
        </Link>
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded bg-neutral-800 hover:bg-neutral-700"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close" : "Open"} menu</span>
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
              <path d="M18.3 5.71 12 12l6.3 6.29-1.42 1.42L10.59 13.4 4.3 19.71 2.88 18.3 9.17 12 2.88 5.71 4.3 4.29 10.59 10.6l6.29-6.3z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
            </svg>
          )}
        </button>

        <div className="hidden md:flex gap-4 items-center">
          <Link href="/" className="hover:text-amber-400">
            Home
          </Link>
          <SignedIn>
            <Link href="/dashboard" className="hover:text-amber-400">
              Dashboard
            </Link>
            {isAdmin && (
              <Link href="/admin" className="hover:text-amber-400">
                Admin
              </Link>
            )}
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="hover:text-amber-400">
              Login
            </Link>
            <Link href="/sign-up" className="hover:text-amber-400">
              Register
            </Link>
          </SignedOut>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-900 px-4 py-3 space-y-2">
          <Link href="/" className="block" onClick={() => setOpen(false)}>
            Home
          </Link>
          <SignedIn>
            <Link href="/dashboard" className="block" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            {isAdmin && (
              <Link href="/admin" className="block" onClick={() => setOpen(false)}>
                Admin
              </Link>
            )}
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="block" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link href="/sign-up" className="block" onClick={() => setOpen(false)}>
              Register
            </Link>
          </SignedOut>
        </div>
      )}
    </header>
  )
}
