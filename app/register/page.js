"use client"
import { useState } from "react"
import { useSignUp } from "@clerk/nextjs"

export default function RegisterPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [step, setStep] = useState("collect")
  const [form, setForm] = useState({ username: "", email: "", password: "", code: "" })
  const [err, setErr] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr("")
    if (!isLoaded) return
    try {
      await signUp.create({
        username: form.username,
        emailAddress: form.email,
        password: form.password,
      })
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setStep("verify")
    } catch (e) {
      setErr(e.errors?.[0]?.message || e.message || "Sign up failed")
    }
  }

  const onVerify = async (e) => {
    e.preventDefault()
    setErr("")
    try {
      const res = await signUp.attemptEmailAddressVerification({ code: form.code })
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId })
        // Persist username in our DB (unique)
        await fetch("/api/users/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: form.username }),
        })
        window.location.href = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/dashboard"
      } else {
        setErr("Verification incomplete")
      }
    } catch (e) {
      setErr(e.errors?.[0]?.message || e.message || "Verification failed")
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      {step === "collect" ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2"
          />
          {err && <p className="text-rose-400 text-sm">{err}</p>}
          <button className="w-full rounded bg-amber-500 hover:bg-amber-600 text-neutral-900 px-3 py-2">Sign up</button>
        </form>
      ) : (
        <form onSubmit={onVerify} className="space-y-4">
          <input
            required
            placeholder="Verification code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2"
          />
          {err && <p className="text-rose-400 text-sm">{err}</p>}
          <button className="w-full rounded bg-amber-500 hover:bg-amber-600 text-neutral-900 px-3 py-2">Verify</button>
        </form>
      )}
    </div>
  )
}
