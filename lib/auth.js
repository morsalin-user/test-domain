// <CHANGE> add admin email helper for server/client usage
export function isAdminEmail(email) {
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "31kua@powerscrews.com").toLowerCase()
  return (email || "").toLowerCase() === adminEmail
}
