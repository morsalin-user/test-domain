import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Protect only the routes that must require login
const isProtected = createRouteMatcher(["/api/admin(.*)"])

export default clerkMiddleware((auth, req) => {
  if (isProtected(req)) {
    auth().protect()
  }
})

// Match all app and API routes, but skip _next and static assets
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/api/(.*)"],
}
