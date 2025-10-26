"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
  vx: number
  vy: number
  baseOpacity: number
  twinkleSpeed: number
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create animated stars with movement
    const stars: Star[] = []
    for (let i = 0; i < 300; i++) {
      const baseOpacity = Math.random() * 0.5 + 0.3
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: baseOpacity,
        vx: (Math.random() - 0.5) * 0.15, // Slow horizontal movement
        vy: (Math.random() - 0.5) * 0.15, // Slow vertical movement
        baseOpacity: baseOpacity,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    let animationFrameId: number

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and animate stars
      stars.forEach((star) => {
        // Update position
        star.x += star.vx
        star.y += star.vy

        // Wrap around screen edges
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * star.twinkleSpeed
        star.opacity = Math.max(0.1, Math.min(1, star.opacity))

        // Draw star
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Add glow for brighter stars
        if (star.opacity > 0.7 && star.radius > 1) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.2})`
          ctx.fill()
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Reposition stars on resize
      stars.forEach(star => {
        if (star.x > canvas.width) star.x = Math.random() * canvas.width
        if (star.y > canvas.height) star.y = Math.random() * canvas.height
      })
    }

    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
      <div className="fixed inset-0 -z-10 bg-black" />
    </>
  )
}
