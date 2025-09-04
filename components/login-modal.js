"use client"
import Link from "next/link"

export default function LoginModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <button aria-label="Close login modal" onClick={onClose} className="absolute inset-0 bg-black/60" />
      {/* dialog */}
      <div className="relative mx-4 w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold text-neutral-100 text-balance">Login to download any video</h3>
        <p className="mb-4 text-sm text-neutral-300">
          You must be signed in to download videos. Please sign in to continue.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Sign in
          </Link>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
