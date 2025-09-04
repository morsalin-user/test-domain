"use client"
import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [form, setForm] = useState({ identifier: "", password: "" })
  const [err, setErr] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr("")
    if (!isLoaded) return
    try {
      const res = await signIn.create({
        identifier: form.identifier, // username or email
        password: form.password,
      })
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId })
        window.location.href = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/dashboard"
      } else {
        setErr("Sign in not complete")
      }
    } catch (e) {
      setErr(e.errors?.[0]?.message || e.message || "Sign in failed")
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          required
          placeholder="Username or Email"
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
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
        <button className="w-full rounded bg-amber-500 hover:bg-amber-600 text-neutral-900 px-3 py-2">Sign in</button>
      </form>
    </div>
  )
}
