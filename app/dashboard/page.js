import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) {
    const signin = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/login"
    redirect(signin)
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-neutral-100">Dashboard</h1>
      <p className="text-neutral-300 mt-2">
        Welcome back, {user.firstName || user.username || user.emailAddresses?.[0]?.emailAddress}.
      </p>
    </main>
  )
}
