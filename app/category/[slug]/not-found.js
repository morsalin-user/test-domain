// app/category/[slug]/not-found.js
import Link from "next/link"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"

export default function CategoryNotFound() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="text-neutral-400 mb-6">
            <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-100 mb-4">Category Not Found</h1>
          <p className="text-neutral-400 mb-8 max-w-md mx-auto">
            The category you're looking for doesn't exist or may have been removed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-medium transition-colors"
            >
              Browse All Videos
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-neutral-700 text-neutral-100 hover:bg-neutral-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}