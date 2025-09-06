// components/advertisement.js
"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const COMPANIES = [
  {
    id: 1,
    name: "TechCorp",
    imageUrl: "/ads/techcorp-logo.png",
    link: "https://techcorp.example.com",
    description: "Leading technology solutions"
  },
  {
    id: 2,
    name: "DigitalFlow",
    imageUrl: "/ads/digitalflow-logo.png",
    link: "https://digitalflow.example.com",
    description: "Digital transformation experts"
  },
  {
    id: 3,
    name: "CloudVision",
    imageUrl: "/ads/cloudvision-logo.png",
    link: "https://cloudvision.example.com",
    description: "Cloud computing solutions"
  },
  {
    id: 4,
    name: "InnovateLabs",
    imageUrl: "/ads/innovatelabs-logo.png",
    link: "https://innovatelabs.example.com",
    description: "Innovation and research"
  },
  {
    id: 5,
    name: "DataStream",
    imageUrl: "/ads/datastream-logo.png",
    link: "https://datastream.example.com",
    description: "Big data analytics"
  }
]

// SVG Placeholder Logo Component
function PlaceholderLogo({ name, className }) {
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-amber-600 to-amber-700 text-black font-bold text-xl ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id={`grad-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#grad-${name})`} rx="8" />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#000"
          fontSize="36"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          {initial}
        </text>
      </svg>
    </div>
  )
}

// Individual Ad Card Component
function AdCard({ company }) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    window.open(company.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer bg-neutral-800 rounded-lg p-4 border border-neutral-700 hover:border-amber-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/10 transform hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Logo Container */}
        <div className="relative w-16 h-16 flex-shrink-0">
          {!imageError ? (
            <Image
              src={company.imageUrl}
              alt={`${company.name} logo`}
              fill
              className="object-contain rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <PlaceholderLogo name={company.name} className="w-full h-full rounded-lg" />
          )}

          {/* Hover Effect Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-amber-600/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          )}
        </div>

        {/* Company Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-neutral-100 text-sm group-hover:text-amber-400 transition-colors">
            {company.name}
          </h3>
          <p className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors">
            {company.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Advertisement() {
  return (
    <section className="w-full mb-8 mt-8">
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <h2 className="text-lg font-semibold text-neutral-100">Our Partners</h2>
          </div>
          <div className="text-xs text-neutral-500 uppercase tracking-wider">
            Sponsored
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {COMPANIES.map((company) => (
            <AdCard key={company.id} company={company} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 text-center">
            Interested in partnering with us?
            <Link
              href="/contact"
              className="text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}