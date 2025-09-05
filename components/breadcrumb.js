// components/breadcrumb.js
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Breadcrumb() {
  const pathname = usePathname()
  
  // Don't show breadcrumb on home page
  if (pathname === "/") return null
  
  const segments = pathname.split("/").filter(Boolean)
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-neutral-400 mb-6">
      <Link 
        href="/" 
        className="hover:text-neutral-200 transition-colors"
      >
        Home
      </Link>
      
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        const isLast = index === segments.length - 1
        const label = segment === "category" ? "Categories" : segment.charAt(0).toUpperCase() + segment.slice(1)
        
        return (
          <div key={segment} className="flex items-center space-x-2">
            <span className="text-neutral-600">/</span>
            {isLast ? (
              <span className="text-neutral-200 font-medium">{label}</span>
            ) : (
              <Link 
                href={href}
                className="hover:text-neutral-200 transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}