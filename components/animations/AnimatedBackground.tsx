"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface FloatingParticle {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<FloatingParticle[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    // Create floating particles
    const particles: FloatingParticle[] = []
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
      })
    }
    particlesRef.current = particles

    // Create particle elements
    particles.forEach((particle, index) => {
      const element = document.createElement("div")
      element.className = "absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 pointer-events-none"
      element.style.width = `${particle.size}px`
      element.style.height = `${particle.size}px`
      element.style.left = `${particle.x}px`
      element.style.top = `${particle.y}px`
      element.style.opacity = particle.opacity.toString()
      containerRef.current?.appendChild(element)

      // Animate particles
      gsap.to(element, {
        y: particle.y - 100,
        x: particle.x + Math.sin(index) * 50,
        duration: 10 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 5,
      })

      gsap.to(element, {
        opacity: particle.opacity * 0.5,
        duration: 3 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
    })

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />
}
