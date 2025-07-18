"use client"

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react"

export function ContentSlideshow({ content }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)
  const containerRef = useRef(null)
  const cardsRef = useRef([])
  const [cardWidth, setCardWidth] = useState(0)
  const [totalWidth, setTotalWidth] = useState(0)
  const speed = 2

  // Handle responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate dimensions and initialize positions
  useEffect(() => {
    if (!content || content.length === 0) return
    const container = containerRef.current
    if (!container) return

    // Wait for next frame to ensure cards are rendered
    requestAnimationFrame(() => {
      const cards = cardsRef.current.filter(Boolean)
      if (cards.length === 0) return

      const containerWidth = container.offsetWidth
      const gap = isMobile ? 20 : 16 // Small gap on mobile, normal gap on desktop
      const singleCardWidth = isMobile ? containerWidth : (containerWidth - 32) / 3 // Full width for mobile

      setCardWidth(singleCardWidth)

      // Calculate total width needed for all cards
      const calculatedTotalWidth = cards.length * (singleCardWidth + gap)
      setTotalWidth(calculatedTotalWidth)

      // Position cards initially
      cards.forEach((card, index) => {
        const initialPos = index * (singleCardWidth + gap)
        card.style.position = 'absolute'
        card.style.left = `${initialPos}px`
        card.style.width = `${singleCardWidth}px`
      })
    })
  }, [content, isMobile])

  // Animation loop
  useEffect(() => {
    if (!isAnimating || !content || content.length === 0 || totalWidth === 0) return
    const cards = cardsRef.current.filter(Boolean)
    if (cards.length === 0) return

    const animate = () => {
      if (!isAnimating) return
      cards.forEach((card) => {
        const currentPos = parseFloat(card.style.left)
        const newPos = currentPos - speed

        // If card has moved completely out of view on the left
        if (newPos < -cardWidth) {
          // Move it to the right side of all cards
          card.style.left = `${newPos + totalWidth}px`
        } else {
          card.style.left = `${newPos}px`
        }
      })
      requestAnimationFrame(animate)
    }

    const animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isAnimating, content, cardWidth, totalWidth, speed])

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (!content || content.length === 0) return null

  return (
    <div className="slideshow-container relative overflow-hidden" style={{ height: '450px' }}>
      <div
        ref={containerRef}
        className="slideshow-track relative h-full"
        style={{ width: '100%' }}
      >
        {content.map((item, index) => (
          <div
            key={item._id}
            ref={el => cardsRef.current[index] = el}
            className="slideshow-item absolute top-0"
          >
            <div className="content-card hover:purple-glow transition-all duration-300 bg-gray-800 p-4 rounded-lg h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-primary bg-purple-600 text-white px-2 py-1 rounded text-xs">
                  {item.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-purple-100 mb-2">
                {truncateText(item.title, 50)}
              </h3>
              <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                {truncateText(item.description, 100)}
              </p>
              <div className="mb-4 rounded-lg overflow-hidden border border-purple-400/30">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt="Content image"
                  className="w-full h-52 object-cover rounded-lg border border-purple-400/30"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">by {item.author}</span>
                <button className="btn btn-primary bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
