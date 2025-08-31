// <CHANGE> add password-based sign in page (Clerk)
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"

export default function SignInPage() {
  const router = useRouter()
  const { isLoaded, signIn, setActive } = useSignIn()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (!isLoaded) return
    setBusy(true)
    setError("")
    try {
      const res = await signIn.create({
        identifier: form.email,
        password: form.password,
      })
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId })
        // clear any pending signup flags
        if (typeof window !== "undefined") {
          localStorage.removeItem("pendingSignupEmail")
          localStorage.removeItem("pendingSignupStartedAt")
        }
        router.push(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/dashboard")
      } else {
        setError("Additional verification is required.")
      }
    } catch (err) {
      setError(err?.errors?.[0]?.longMessage || "Sign in failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-foreground flex items-center">
      <div className="mx-auto w-full max-w-md px-4">
        <h1 className="text-2xl font-semibold text-primary">Sign in</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-foreground/80">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full rounded-md bg-background border border-border px-3 py-2 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-foreground/80">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              className="w-full rounded-md bg-background border border-border px-3 py-2 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-secondary">{error}</p>}
          <button
            disabled={busy}
            className="w-full rounded-md bg-primary text-primary-foreground py-2.5 font-medium hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  )
}
