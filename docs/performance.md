# Performance Optimization Guide

## 🚀 Performance Philosophy

The Daily Journal application prioritizes smooth user experience through strategic performance optimization. This guide covers React optimization, animation performance, bundle optimization, and runtime performance monitoring.

## ⚡ React Performance Optimization

### 1. Component Memoization
\`\`\`typescript
// Memoize expensive components
const ExpensiveAnalytics = React.memo(({ entries, dateRange }) => {
  const processedData = useMemo(() => {
    return entries
      .filter(entry => isInDateRange(entry.date, dateRange))
      .map(entry => calculateMetrics(entry))
  }, [entries, dateRange])
  
  return <AnalyticsChart data={processedData} />
})

// Memoize callback functions
const TodoList = ({ todos, onToggle, onRemove }) => {
  const handleToggle = useCallback((id) => {
    onToggle(id)
  }, [onToggle])
  
  const handleRemove = useCallback((id) => {
    onRemove(id)
  }, [onRemove])
  
  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onRemove={handleRemove}
        />
      ))}
    </div>
  )
}
\`\`\`

### 2. State Optimization
\`\`\`typescript
// Avoid unnecessary re-renders by splitting state
const JournalForm = () => {
  // Split form state to minimize re-renders
  const [todos, setTodos] = useState([])
  const [ratings, setRatings] = useState({ mood: 0, energy: 0 })
  const [textFields, setTextFields] = useState({ 
    accomplishments: '', 
    gratitude: '' 
  })
  
  // Use functional updates to avoid stale closures
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }])
  }, [])
  
  const updateRating = useCallback((type, value) => {
    setRatings(prev => ({ ...prev, [type]: value }))
  }, [])
  
  return (
    <form>
      <TodoSection todos={todos} onAddTodo={addTodo} />
      <RatingSection ratings={ratings} onUpdateRating={updateRating} />
      <TextFieldsSection fields={textFields} onUpdate={setTextFields} />
    </form>
  )
}
\`\`\`

### 3. Virtual Scrolling for Large Lists
\`\`\`typescript
import { FixedSizeList as List } from 'react-window'

const VirtualizedEntryList = ({ entries }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <EntryCard entry={entries[index]} />
    </div>
  )
  
  return (
    <List
      height={600}
      itemCount={entries.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </List>
  )
}
\`\`\`

## 🎭 Animation Performance

### 1. Hardware Acceleration
\`\`\`css
/* Force hardware acceleration for animated elements */
.animated-element {
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* Remove will-change after animation completes */
.animation-complete {
  will-change: auto;
}
\`\`\`

\`\`\`typescript
// Programmatically manage will-change
const AnimatedCard = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  
  return (
    <motion.div
      style={{ willChange: isAnimating ? 'transform, opacity' : 'auto' }}
      onAnimationStart={() => setIsAnimating(true)}
      onAnimationComplete={() => setIsAnimating(false)}
      whileHover={{ scale: 1.05 }}
    >
      Card content
    </motion.div>
  )
}
\`\`\`

### 2. Animation Batching
\`\`\`typescript
// Batch multiple animations together
const BatchedAnimations = () => {
  const controls = useAnimation()
  
  const animateSequence = async () => {
    // Batch animations to avoid layout thrashing
    await controls.start({
      opacity: [0, 1],
      scale: [0.8, 1],
      y: [20, 0],
      transition: { duration: 0.5 }
    })
  }
  
  return (
    <motion.div animate={controls}>
      Content
    </motion.div>
  )
}
\`\`\`

### 3. Conditional Animation Rendering
\`\`\`typescript
const ConditionalAnimations = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isLowEndDevice = useMediaQuery('(max-width: 480px)')
  
  const shouldAnimate = !prefersReducedMotion && !isLowEndDevice
  
  if (!shouldAnimate) {
    return <StaticComponent />
  }
  
  return <AnimatedComponent />
}
\`\`\`

## 📦 Bundle Optimization

### 1. Code Splitting
\`\`\`typescript
// Route-based code splitting
const LazyAnalytics = lazy(() => import('./components/Analytics'))
const LazySettings = lazy(() => import('./components/Settings'))

const App = () => (
  <Router>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Journal />} />
        <Route path="/analytics" element={<LazyAnalytics />} />
        <Route path="/settings" element={<LazySettings />} />
      </Routes>
    </Suspense>
  </Router>
)

// Component-based code splitting
const HeavyChart = lazy(() => 
  import('./HeavyChart').then(module => ({ default: module.HeavyChart }))
)
\`\`\`

### 2. Tree Shaking Optimization
\`\`\`typescript
// Import only what you need
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Star } from 'lucide-react'

// Avoid importing entire libraries
// ❌ import * as icons from 'lucide-react'
// ✅ import { Calendar, Star } from 'lucide-react'

// Use dynamic imports for heavy utilities
const loadChartLibrary = async () => {
  const { Chart } = await import('chart.js')
  return Chart
}
\`\`\`

### 3. Asset Optimization
\`\`\`typescript
// Lazy load images
const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef()
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={imgRef} {...props}>
      {isInView && (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  )
}
\`\`\`

## 💾 Storage Performance

### 1. Efficient LocalStorage Usage
\`\`\`typescript
// Debounced storage updates
const useDebounceStorage = (key, value, delay = 500) => {
  const debouncedValue = useDebounce(value, delay)
  
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(debouncedValue))
    } catch (error) {
      console.error('Storage error:', error)
    }
  }, [key, debouncedValue])
}

// Chunked data storage for large datasets
const storeDataInChunks = (key, data, chunkSize = 1000) => {
  const chunks = []
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize))
  }
  
  chunks.forEach((chunk, index) => {
    localStorage.setItem(`${key}_chunk_${index}`, JSON.stringify(chunk))
  })
  
  localStorage.setItem(`${key}_meta`, JSON.stringify({ 
    totalChunks: chunks.length,
    totalItems: data.length
  }))
}
\`\`\`

### 2. Memory Management
\`\`\`typescript
// Cleanup heavy objects
const HeavyComponent = () => {
  const heavyDataRef = useRef(null)
  
  useEffect(() => {
    // Create heavy data structure
    heavyDataRef.current = createHeavyData()
    
    return () => {
      // Cleanup on unmount
      heavyDataRef.current = null
    }
  }, [])
  
  return <div>Component content</div>
}

// Use WeakMap for object references
const componentCache = new WeakMap()

const getCachedComponent = (key) => {
  if (componentCache.has(key)) {
    return componentCache.get(key)
  }
  
  const component = createExpensiveComponent(key)
  componentCache.set(key, component)
  return component
}
\`\`\`

## 📊 Performance Monitoring

### 1. Performance Metrics
\`\`\`typescript
// Custom performance hook
const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({})
  
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          setMetrics(prev => ({
            ...prev,
            [entry.name]: entry.duration
          }))
        }
      })
    })
    
    observer.observe({ entryTypes: ['measure'] })
    
    return () => observer.disconnect()
  }, [])
  
  const startMeasure = (name) => {
    performance.mark(`${name}-start`)
  }
  
  const endMeasure = (name) => {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
  }
  
  return { metrics, startMeasure, endMeasure }
}

// Usage
const ExpensiveComponent = () => {
  const { startMeasure, endMeasure } = usePerformanceMetrics()
  
  useEffect(() => {
    startMeasure('data-processing')
    processHeavyData()
    endMeasure('data-processing')
  }, [])
  
  return <div>Component</div>
}
\`\`\`

### 2. Bundle Analysis
\`\`\`bash
# Analyze bundle size
npm run build -- --analyze

# Check for duplicate dependencies
npx webpack-bundle-analyzer build/static/js/*.js
\`\`\`

### 3. Runtime Performance Monitoring
\`\`\`typescript
// Monitor component render times
const withPerformanceMonitoring = (WrappedComponent) => {
  return (props) => {
    const renderStart = performance.now()
    
    useEffect(() => {
      const renderEnd = performance.now()
      const renderTime = renderEnd - renderStart
      
      if (renderTime > 16) { // Longer than one frame
        console.warn(`Slow render: ${WrappedComponent.name} took ${renderTime}ms`)
      }
    })
    
    return <WrappedComponent {...props} />
  }
}
\`\`\`

## 🔧 Development Tools

### 1. React DevTools Profiler
\`\`\`typescript
// Wrap components for profiling
const ProfiledComponent = ({ children }) => {
  return (
    <Profiler
      id="journal-section"
      onRender={(id, phase, actualDuration) => {
        if (actualDuration > 5) {
          console.log(`${id} ${phase} took ${actualDuration}ms`)
        }
      }}
    >
      {children}
    </Profiler>
  )
}
\`\`\`

### 2. Performance Budget
\`\`\`javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 250000,
    maxEntrypointSize: 250000,
    hints: 'warning'
  }
}
\`\`\`

## 📱 Mobile Performance

### 1. Touch Optimization
\`\`\`css
/* Improve touch responsiveness */
.touch-element {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Optimize scrolling */
.scroll-container {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
\`\`\`

### 2. Viewport Optimization
\`\`\`typescript
// Optimize for mobile viewports
const MobileOptimized = () => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
  
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <div style={{ height: viewportHeight }}>
      Mobile-optimized content
    </div>
  )
}
\`\`\`

This performance optimization guide ensures the journal application remains fast, responsive, and efficient across all devices and usage patterns.
