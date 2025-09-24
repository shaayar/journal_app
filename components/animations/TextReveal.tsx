"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export function TextReveal({ text, className = "", delay = 0, duration = 0.05 }: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  const letters = text.split("")

  return (
    <motion.div className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={
            isVisible
              ? {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                }
              : {}
          }
          transition={{
            delay: index * duration,
            duration: 0.3,
            ease: "easeOut",
          }}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}
