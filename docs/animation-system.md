# Animation System Guide

## 🎭 Animation Philosophy

The Daily Journal application uses a layered animation system combining Framer Motion for React-specific animations and GSAP for complex timeline animations. This guide covers implementation patterns, performance optimization, and best practices.

## 🛠 Animation Technology Stack

### Core Libraries
- **Framer Motion**: React-first animation library
- **GSAP**: Professional-grade animation engine
- **CSS Transitions**: Simple state changes
- **Tailwind Animate**: Utility-first CSS animations

### Animation Hierarchy
1. **Page Level**: Route transitions, theme changes
2. **Section Level**: Card entrances, layout shifts
3. **Component Level**: Interactive states, micro-interactions
4. **Element Level**: Icon animations, loading states

## 🎨 Framer Motion Patterns

### 1. Basic Animation Variants
\`\`\`typescript
// Standard animation variants
const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.95,
    transition: { 
      duration: 0.3 
    }
  }
}

// Usage
<motion.div
  variants={fadeInUp}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  Content
</motion.div>
\`\`\`

### 2. Stagger Animations
\`\`\`typescript
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
}

const staggerItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

// Implementation
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map((item, index) => (
    <motion.div key={index} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
\`\`\`

### 3. Interactive Animations
\`\`\`typescript
const interactiveButton = {
  hover: { 
    scale: 1.05, 
    y: -2,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 17 
    }
  },
  tap: { 
    scale: 0.95,
    transition: { 
      duration: 0.1 
    }
  }
}

// Usage
<motion.button
  variants={interactiveButton}
  whileHover="hover"
  whileTap="tap"
  className="px-4 py-2 bg-primary text-white rounded-lg"
>
  Click me
</motion.button>
\`\`\`

### 4. Layout Animations
\`\`\`typescript
const TodoItem = ({ todo, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8, x: -100 }}
    transition={{ 
      layout: { duration: 0.3 },
      opacity: { duration: 0.2 }
    }}
    className="p-3 bg-card rounded-lg"
  >
    <span>{todo.text}</span>
    <button onClick={onRemove}>Remove</button>
  </motion.div>
)

// Wrap in AnimatePresence for exit animations
<AnimatePresence mode="popLayout">
  {todos.map(todo => (
    <TodoItem key={todo.id} todo={todo} onRemove={handleRemove} />
  ))}
</AnimatePresence>
\`\`\`

## ⚡ GSAP Integration

### 1. Timeline Animations
\`\`\`typescript
import { gsap } from 'gsap'
import { useRef, useEffect } from 'react'

const ComplexAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  
  useEffect(() => {
    const tl = gsap.timeline()
    
    // Set initial states
    gsap.set([titleRef.current, ...cardsRef.current], {
      opacity: 0,
      y: 50,
      scale: 0.8
    })
    
    // Animate sequence
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)"
    })
    .to(cardsRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.5")
    
    return () => tl.kill() // Cleanup
  }, [])
  
  return (
    <div ref={containerRef}>
      <h1 ref={titleRef}>Daily Journal</h1>
      {cards.map((card, index) => (
        <div 
          key={index}
          ref={el => cardsRef.current[index] = el}
        >
          {card.content}
        </div>
      ))}
    </div>
  )
}
\`\`\`

### 2. Scroll-Triggered Animations
\`\`\`typescript
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ScrollAnimation = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const section = sectionRef.current
    
    gsap.fromTo(section, 
      {
        opacity: 0,
        y: 100
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )
  }, [])
  
  return <div ref={sectionRef}>Scroll-triggered content</div>
}
\`\`\`

### 3. Morphing Animations
\`\`\`typescript
const MorphingShape = () => {
  const shapeRef = useRef<HTMLDivElement>(null)
  
  const morphToCircle = () => {
    gsap.to(shapeRef.current, {
      borderRadius: "50%",
      rotation: 180,
      scale: 1.2,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)"
    })
  }
  
  const morphToSquare = () => {
    gsap.to(shapeRef.current, {
      borderRadius: "0%",
      rotation: 0,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    })
  }
  
  return (
    <div
      ref={shapeRef}
      className="w-16 h-16 bg-primary cursor-pointer"
      onClick={morphToCircle}
      onDoubleClick={morphToSquare}
    />
  )
}
\`\`\`

## 🎯 Animation Patterns Library

### 1. Card Entrance Animations
\`\`\`typescript
export const cardAnimations = {
  slideInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  },
  
  slideInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  },
  
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.4,
        ease: "backOut"
      }
    }
  },
  
  flipIn: {
    hidden: { opacity: 0, rotateY: -90 },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      transition: { 
        duration: 0.6,
        ease: "power2.out"
      }
    }
  }
}
\`\`\`

### 2. Loading Animations
\`\`\`typescript
export const loadingAnimations = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  },
  
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeOut"
    }
  }
}
\`\`\`

### 3. Notification Animations
\`\`\`typescript
export const notificationAnimations = {
  slideInFromTop: {
    initial: { opacity: 0, y: -50, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: -50, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  },
  
  slideInFromRight: {
    initial: { opacity: 0, x: 300 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: 300,
      transition: { duration: 0.3 }
    }
  }
}
\`\`\`

## 🔧 Performance Optimization

### 1. Animation Performance Best Practices
\`\`\`typescript
// Use transform and opacity for best performance
const optimizedAnimation = {
  hidden: { 
    opacity: 0, 
    transform: "translateY(20px) scale(0.95)" 
  },
  visible: { 
    opacity: 1, 
    transform: "translateY(0px) scale(1)",
    transition: { duration: 0.5 }
  }
}

// Avoid animating layout properties
const avoidThis = {
  hidden: { width: 0, height: 0 }, // Causes layout recalculation
  visible: { width: 200, height: 100 }
}

// Use this instead
const useThis = {
  hidden: { opacity: 0, scaleX: 0, scaleY: 0 },
  visible: { opacity: 1, scaleX: 1, scaleY: 1 }
}
\`\`\`

### 2. Conditional Animation Rendering
\`\`\`typescript
const ConditionalAnimation = ({ shouldAnimate, children }) => {
  if (!shouldAnimate) {
    return <div>{children}</div>
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
\`\`\`

### 3. Animation Cleanup
\`\`\`typescript
const AnimatedComponent = () => {
  const animationRef = useRef<gsap.core.Timeline>()
  
  useEffect(() => {
    animationRef.current = gsap.timeline()
    
    animationRef.current.to(".element", {
      duration: 2,
      x: 100,
      repeat: -1
    })
    
    return () => {
      // Cleanup animation on unmount
      animationRef.current?.kill()
    }
  }, [])
  
  return <div className="element">Animated content</div>
}
\`\`\`

## 🎨 Theme-Aware Animations

### 1. Dark/Light Mode Transitions
\`\`\`typescript
const ThemeTransition = ({ isDark }) => {
  return (
    <motion.div
      animate={{
        backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000"
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      Content that transitions with theme
    </motion.div>
  )
}
\`\`\`

### 2. Color Morphing
\`\`\`typescript
const ColorMorphing = ({ mood }) => {
  const moodColors = {
    happy: "#10b981",
    neutral: "#6b7280", 
    sad: "#3b82f6"
  }
  
  return (
    <motion.div
      animate={{
        backgroundColor: moodColors[mood],
        scale: mood === 'happy' ? 1.05 : 1
      }}
      transition={{ duration: 0.5 }}
      className="w-16 h-16 rounded-full"
    />
  )
}
\`\`\`

## 📱 Responsive Animation Patterns

### 1. Mobile-Optimized Animations
\`\`\`typescript
const ResponsiveAnimation = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  const variants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 10 : 20,
      scale: isMobile ? 0.98 : 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: isMobile ? 0.3 : 0.5,
        ease: "easeOut"
      }
    }
  }
  
  return (
    <motion.div variants={variants} initial="hidden" animate="visible">
      Responsive animated content
    </motion.div>
  )
}
\`\`\`

### 2. Reduced Motion Support
\`\`\`typescript
const AccessibleAnimation = ({ children }) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  
  if (prefersReducedMotion) {
    return <div>{children}</div>
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
\`\`\`

## 🚀 Advanced Animation Techniques

### 1. Physics-Based Animations
\`\`\`typescript
const PhysicsAnimation = () => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.1 }}
      className="w-16 h-16 bg-primary rounded-lg cursor-grab active:cursor-grabbing"
    />
  )
}
\`\`\`

### 2. Path Animations
\`\`\`typescript
const PathAnimation = () => {
  return (
    <motion.div
      animate={{
        x: [0, 100, 100, 0, 0],
        y: [0, 0, 100, 100, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }}
      className="w-4 h-4 bg-primary rounded-full"
    />
  )
}
\`\`\`

### 3. Gesture-Based Animations
\`\`\`typescript
const GestureAnimation = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) {
          setIsOpen(true)
        } else if (info.offset.x < -100) {
          setIsOpen(false)
        }
      }}
      animate={{ x: isOpen ? 200 : 0 }}
      className="w-16 h-16 bg-primary rounded-lg"
    />
  )
}
\`\`\`

This comprehensive animation system provides the foundation for creating engaging, performant, and accessible animations throughout the journal application.
