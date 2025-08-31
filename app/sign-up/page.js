// <CHANGE> add password-based sign up with OTP verification and pending cleanup flag
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp()
  const [stage, setStage] = useState("collect")
  const [form, setForm] = useState({ email: "", password: "", code: "" })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  // schedule a best-effort cleanup in 15 minutes if user abandons verification
  useEffect(() => {
    if (stage === "verify" && form.email) {
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingSignupEmail", form.email)
        localStorage.setItem("pendingSignupStartedAt", String(Date.now()))
      }
      const t = setTimeout(() => {
        fetch("/api/clerk/cleanup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, minutes: 15 }),
        }).catch(() => {})
      }, 15 * 60 * 1000)
      return () => clearTimeout(t)
    }
  }, [stage, form.email])

  async function submitCollect(e) {
    e.preventDefault()
    if (!isLoaded) return
    setBusy(true)
    setError("")
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setStage("verify")
    } catch (err) {
      setError(err?.errors?.[0]?.longMessage || "Sign up failed")
    } finally {
      setBusy(false)
    }
  }

  async function submitVerify(e) {
    e.preventDefault()
    if (!isLoaded) return
    setBusy(true)
    setError("")
    try {
      const res = await signUp.attemptEmailAddressVerification({ code: form.code })
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId })

        // store email + hashed password in Mongo (server route hashes)
        await fetch("/api/users/upsert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        })

        if (typeof window !== "undefined") {
          localStorage.removeItem("pendingSignupEmail")
          localStorage.removeItem("pendingSignupStartedAt")
        }

        router.push(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/dashboard")
      } else {
        setError("Verification not complete yet.")
      }
    } catch (err) {
      setError(err?.errors?.[0]?.longMessage || "Verification failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-foreground flex items-center">
      <div className="mx-auto w-full max-w-md px-4">
        <h1 className="text-2xl font-semibold text-primary">Create your account</h1>

        {stage === "collect" && (
          <form onSubmit={submitCollect} className="mt-6 space-y-4">
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
                minLength={8}
                className="w-full rounded-md bg-background border border-border px-3 py-2 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="At least 8 characters"
              />
            </div>
            {error && <p className="text-sm text-secondary">{error}</p>}
            <button
              disabled={busy}
              className="w-full rounded-md bg-primary text-primary-foreground py-2.5 font-medium hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Sending code..." : "Sign up"}
            </button>
          </form>
        )}

        {stage === "verify" && (
          <form onSubmit={submitVerify} className="mt-6 space-y-4">
            <p className="text-foreground/80">We’ve sent a 6-digit code to {form.email}.</p>
            <div>
              <label className="block text-sm mb-1 text-foreground/80">Verification code</label>
              <input
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.code}
                onChange={onChange}
                required
                className="w-full rounded-md bg-background border border-border px-3 py-2 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="123456"
              />
            </div>
            {error && <p className="text-sm text-secondary">{error}</p>}
            <button
              disabled={busy}
              className="w-full rounded-md bg-primary text-primary-foreground py-2.5 font-medium hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Verifying..." : "Verify & continue"}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
