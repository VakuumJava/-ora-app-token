"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:backdrop-blur-3xl group"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "0.5px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "40px",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.12), inset 0 0.5px 0 0 rgba(255, 255, 255, 0.05)",
      }}
      aria-label="Scroll to top"
    >
      {/* Icon */}
      <div 
        className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          border: "0.5px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <ArrowUp 
          className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" 
          style={{ color: "rgba(255, 255, 255, 0.95)" }}
        />
      </div>

      {/* Text */}
      <span 
        className="text-sm font-medium pr-1"
        style={{ 
          color: "rgba(255, 255, 255, 0.9)",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        Наверх
      </span>
    </button>
  )
}
