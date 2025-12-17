# Component Structure Guide

## 🧩 Component Design Philosophy

This guide outlines the systematic approach to designing, structuring, and organizing components in the Daily Journal application. Follow these patterns to maintain consistency and scalability.

## 📋 Component Categories

### 1. Page Components
**Location**: `app/` directory  
**Purpose**: Top-level route components  
**Characteristics**:
- Handle data fetching and state management
- Compose multiple section components
- Manage page-level animations and transitions

```typescript
// Example: app/page.tsx
export default function DailyJournal() {
  // State management
  const [entry, setEntry] = useState<JournalEntry>(initialEntry)
  
  // Page-level effects
  useEffect(() => {
    // Data loading, theme setup
  }, [])
  
  return (
    <motion.div className="min-h-screen p-4 md:p-8">
      {/* Section components */}
    </motion.div>
  )
}
```

### 2. Section Components
**Purpose**: Major functional areas of the application  
**Characteristics**:
- Self-contained functionality
- Consistent card-based layout
- Color-coded theming
- Animation integration

```typescript
// Pattern for section components
const ProductivitySection = () => {
  return (
    <motion.div variants={cardVariants}>
      <Card className="glass-primary border-2 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <motion.div className="w-2 h-2 rounded-full bg-blue-500" />
            Section Title
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Section content */}
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

### 3. UI Components
**Location**: `components/ui/` directory  
**Purpose**: Reusable interface elements  
**Characteristics**:
- Highly reusable across sections
- Consistent API design
- Built on Radix UI primitives
- Styled with Tailwind CSS

### 4. Feature Components
**Purpose**: Specific functionality components  
**Examples**: StarRating, TodoItem, AnalyticsChart  
**Characteristics**:
- Domain-specific logic
- Reusable within feature area
- Animation-ready

## 🎨 Styling Patterns

### Glass Morphism Classes
```css
.glass-card {
  @apply bg-card/80 backdrop-blur-md border border-border/20;
}

.glass-primary {
  @apply bg-primary/10 backdrop-blur-md border border-primary/20;
}

.glass-success {
  @apply bg-green-500/10 backdrop-blur-md border border-green-500/20;
}
```

### Color Coding System
- **Blue**: Productivity and tasks (`text-blue-400`, `border-blue-500`)
- **Green**: Gratitude and positive content (`text-green-400`, `border-green-500`)
- **Amber**: Reflection and learning (`text-amber-400`, `border-amber-500`)
- **Purple**: Goals and future planning (`text-purple-400`, `border-purple-500`)
- **Red**: Data management and warnings (`text-red-400`, `border-red-500`)
- **Indigo**: Analytics and insights (`text-indigo-400`, `border-indigo-500`)

## 🎭 Animation Integration

### Component Animation Patterns

#### 1. Card Entrance Animations
```typescript
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}
```

#### 2. Stagger Animations for Lists
```typescript
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}
```

#### 3. Interactive Element Animations
```typescript
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Button Content
</motion.button>
```

## 📝 Component Development Checklist

### ✅ Structure Requirements
- [ ] Proper TypeScript interfaces defined
- [ ] Consistent naming conventions
- [ ] Appropriate component category placement
- [ ] Props interface with clear documentation

### ✅ Styling Requirements
- [ ] Uses design system color variables
- [ ] Implements glassmorphism effects where appropriate
- [ ] Responsive design with mobile-first approach
- [ ] Consistent spacing using Tailwind scale

### ✅ Animation Requirements
- [ ] Entrance animations implemented
- [ ] Hover and interaction states defined
- [ ] Loading and transition states handled
- [ ] Performance optimized (hardware acceleration)

### ✅ Accessibility Requirements
- [ ] Proper ARIA labels and roles
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Color contrast compliance
- [ ] Focus management

### ✅ Performance Requirements
- [ ] Memoization where appropriate
- [ ] Efficient re-render patterns
- [ ] Animation cleanup on unmount
- [ ] Optimized bundle size

## 🔧 Component Composition Patterns

### 1. Compound Components
For complex UI elements with multiple parts:

```typescript
const StarRating = {
  Container: ({ children, ...props }) => <div {...props}>{children}</div>,
  Star: ({ filled, onClick }) => <Star className={filled ? "fill-amber-400" : ""} onClick={onClick} />,
  Label: ({ children }) => <label className="text-sm font-medium">{children}</label>
}

// Usage
<StarRating.Container>
  <StarRating.Label>Rating</StarRating.Label>
  <StarRating.Star filled={true} onClick={handleClick} />
</StarRating.Container>
```

### 2. Render Props Pattern
For flexible, reusable logic:

```typescript
const AnimatedList = ({ items, children }) => (
  <motion.div variants={staggerContainer}>
    {items.map((item, index) => 
      children({ item, index, variants: itemVariants })
    )}
  </motion.div>
)

// Usage
<AnimatedList items={todos}>
  {({ item, variants }) => (
    <motion.div variants={variants}>
      {item.text}
    </motion.div>
  )}
</AnimatedList>
```

### 3. Higher-Order Components (HOCs)
For cross-cutting concerns:

```typescript
const withAnimation = (Component, animationVariants) => {
  return (props) => (
    <motion.div variants={animationVariants}>
      <Component {...props} />
    </motion.div>
  )
}

const AnimatedCard = withAnimation(Card, cardVariants)
```

## 📊 Component Testing Strategy

### Unit Testing
- Test component rendering
- Test prop handling
- Test user interactions
- Test accessibility features

### Integration Testing
- Test component composition
- Test data flow between components
- Test animation sequences

### Visual Testing
- Screenshot testing for UI consistency
- Cross-browser compatibility
- Responsive design validation

## 🚀 Performance Optimization

### Memoization Strategy
```typescript
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => 
    expensiveCalculation(data), [data]
  )
  
  const handleUpdate = useCallback((newData) => {
    onUpdate(newData)
  }, [onUpdate])
  
  return <div>{/* Component content */}</div>
})
```

### Animation Performance
- Use `transform` and `opacity` for animations
- Implement `will-change` for complex animations
- Clean up GSAP timelines on unmount
- Use `AnimatePresence` for exit animations

This component structure guide ensures consistency, maintainability, and scalability across the entire application while providing clear patterns for future development.
