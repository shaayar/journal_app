# Animation Examples & Implementation Guide

## Overview
This document provides practical examples of implementing advanced animations in the Daily Journal app using Framer Motion and GSAP.

## Advanced Animation Components

### 1. AnimatedBackground
Creates floating particles with GSAP animations for ambient background effects.

```tsx
import { AnimatedBackground } from '@/components/animations/AnimatedBackground'

// Usage in layout or page
<AnimatedBackground />
```

**Features:**
- 20 floating particles with random properties
- Sine wave motion patterns
- Opacity pulsing effects
- Performance optimized with cleanup

### 2. MorphingCard
Enhanced card component with 3D hover effects and gradient borders.

```tsx
import { MorphingCard } from '@/components/animations/MorphingCard'

<MorphingCard 
  hoverScale={1.05} 
  morphDuration={0.4}
  className="glass-primary"
>
  <CardContent>Your content here</CardContent>
</MorphingCard>
```

**Features:**
- 3D perspective transforms
- Animated gradient borders
- Glow effects on hover
- Spring-based animations

### 3. TextReveal
Letter-by-letter text animation with 3D rotation effects.

```tsx
import { TextReveal } from '@/components/animations/TextReveal'

<TextReveal 
  text="Daily Journal & Reflection"
  delay={0.5}
  duration={0.08}
  className="text-4xl font-bold"
/>
```

**Features:**
- Individual letter animations
- 3D rotation reveals
- Customizable timing
- Staggered entrance effects

### 4. ParallaxSection
Scroll-based parallax animations with opacity transitions.

```tsx
import { ParallaxSection } from '@/components/animations/ParallaxSection'

<ParallaxSection speed={0.3} direction="up">
  <YourContent />
</ParallaxSection>
```

**Features:**
- Scroll-triggered animations
- Configurable speed and direction
- Opacity fade transitions
- Performance optimized

### 5. AnimatedCounter
Smooth number counting animations with spring physics.

```tsx
import { AnimatedCounter } from '@/components/animations/AnimatedCounter'

<AnimatedCounter 
  value={completedTasks} 
  duration={1.5}
  suffix=" tasks completed"
/>
```

**Features:**
- Spring-based counting
- Locale-aware number formatting
- Customizable prefixes/suffixes
- Smooth transitions

## Implementation Patterns

### Page-Level Animations
```tsx
// Staggered container animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
}
```

### Interactive Animations
```tsx
// Button with micro-interactions
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

### Layout Animations
```tsx
// Automatic layout animations for dynamic content
<motion.div layout layoutId="unique-id">
  {items.map(item => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Performance Considerations

### 1. Animation Optimization
- Use `transform` and `opacity` for smooth 60fps animations
- Avoid animating layout properties (width, height, padding)
- Use `will-change` CSS property sparingly
- Implement proper cleanup in useEffect hooks

### 2. Reduced Motion Support
```tsx
const prefersReducedMotion = useReducedMotion()

const variants = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: prefersReducedMotion ? 0 : 0.5 }
  }
}
```

### 3. Conditional Animations
```tsx
// Only animate on larger screens
const shouldAnimate = useMediaQuery('(min-width: 768px)')

<motion.div
  animate={shouldAnimate ? { scale: 1.05 } : {}}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## Integration with Journal App

### 1. Card Animations
Replace existing cards with MorphingCard components for enhanced interactivity.

### 2. Background Effects
Add AnimatedBackground to the main layout for ambient particle effects.

### 3. Text Animations
Use TextReveal for section headers and important announcements.

### 4. Counter Animations
Implement AnimatedCounter for statistics and progress indicators.

### 5. Scroll Effects
Add ParallaxSection to create depth and visual interest during scrolling.

## Custom Animation Hooks

### useStaggeredAnimation
```tsx
export function useStaggeredAnimation(items: any[], delay = 0.1) {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: delay,
          delayChildren: 0.2
        }
      }
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
      }
    }
  }
}
```

### useScrollAnimation
```tsx
export function useScrollAnimation() {
  const { scrollYProgress } = useScroll()
  
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  
  return { scaleX, opacity, scrollYProgress }
}
```

## Testing Animations

### 1. Performance Testing
- Use Chrome DevTools Performance tab
- Monitor frame rates during animations
- Check for layout thrashing
- Measure animation smoothness

### 2. Accessibility Testing
- Test with reduced motion preferences
- Ensure animations don't cause seizures
- Verify keyboard navigation works with animations
- Test screen reader compatibility

### 3. Cross-Browser Testing
- Test on different browsers and devices
- Verify animation fallbacks work
- Check for vendor prefix requirements
- Test on low-powered devices

## Best Practices

1. **Start Simple**: Begin with basic animations and gradually add complexity
2. **Performance First**: Always prioritize smooth 60fps animations
3. **Meaningful Motion**: Ensure animations serve a purpose and enhance UX
4. **Consistent Timing**: Use consistent easing and duration across the app
5. **Accessibility**: Always provide reduced motion alternatives
6. **Progressive Enhancement**: Ensure the app works without animations
7. **Testing**: Test animations on various devices and connection speeds

## Troubleshooting

### Common Issues
1. **Janky Animations**: Use transform instead of changing layout properties
2. **Memory Leaks**: Implement proper cleanup in animation components
3. **Performance Issues**: Reduce number of simultaneous animations
4. **Layout Shifts**: Use layout animations for dynamic content changes

### Debug Tools
- React DevTools Profiler
- Chrome DevTools Performance
- Framer Motion DevTools
- GSAP DevTools (GSDevTools)
```

```css file="" isHidden
