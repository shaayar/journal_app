"use client"

import { motion } from "framer-motion"
import { type ReactNode, useState } from "react"

interface MorphingCardProps {
  children: ReactNode
  className?: string
  hoverScale?: number
  morphDuration?: number
}

export function MorphingCard({ children, className = "", hoverScale = 1.02, morphDuration = 0.3 }: MorphingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: hoverScale,
        rotateY: 2,
        rotateX: 1,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: morphDuration,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0"
        animate={{
          opacity: isHovered ? 1 : 0,
          background: isHovered ? "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)" : "transparent",
        }}
        transition={{ duration: morphDuration }}
        style={{
          backgroundSize: "300% 300%",
          animation: isHovered ? "gradientShift 3s ease infinite" : "none",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 h-full"
        animate={{
          y: isHovered ? -2 : 0,
        }}
        transition={{ duration: morphDuration }}
      >
        {children}
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg blur-xl opacity-0"
        animate={{
          opacity: isHovered ? 0.3 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: morphDuration }}
        style={{
          background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)",
          zIndex: -1,
        }}
      />
    </motion.div>
  )
}
