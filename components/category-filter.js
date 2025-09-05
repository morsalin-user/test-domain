// components/category-filter.js
"use client"
import { useRouter, usePathname } from "next/navigation"

export default function CategoryFilter({ categories = [], currentCategory = "all" }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const handleCategoryClick = (category) => {
    if (category === "all") {
      router.push("/")
    } else {
      router.push(`/category/${category}`)
    }
  }

  const allCategories = ["all", ...categories]
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-neutral-100 mb-4">Browse Categories</h2>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => {
          const isActive = (category === "all" && pathname === "/") || 
                          pathname === `/category/${category}`
          
          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-600 text-black" 
                  : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              }`}
            >
              {category === "all" ? "All Videos" : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          )
        })}
      </div>
    </div>
  )
}