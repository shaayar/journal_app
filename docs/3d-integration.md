# 3D Integration Guide

## 🌟 3D Elements in Journal Applications

This guide covers integrating 3D elements into the Daily Journal application using React Three Fiber, Three.js, and Drei. Learn how to add immersive 3D backgrounds, interactive elements, and animated scenes.

## 🛠 Technology Stack

### Core Libraries
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **Drei**: Useful helpers for React Three Fiber
- **GSAP**: Timeline animations for 3D scenes

### Installation
\`\`\`bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
\`\`\`

## 🎨 3D Design Patterns

### 1. Background 3D Scenes
Create ambient 3D backgrounds that enhance the journaling experience without distracting from content.

\`\`\`typescript
// components/3d/JournalBackground.tsx
import { Canvas } from '@react-three/fiber'
import { Environment, Float, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'

const FloatingOrbs = () => {
  return (
    <>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.5, 32, 32]} position={[-2, 1, -2]}>
          <meshStandardMaterial color="#3b82f6" opacity={0.3} transparent />
        </Sphere>
      </Float>
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.3, 32, 32]} position={[2, -1, -1]}>
          <meshStandardMaterial color="#10b981" opacity={0.2} transparent />
        </Sphere>
      </Float>
      
      <Float speed={1} rotationIntensity={2} floatIntensity={3}>
        <Sphere args={[0.4, 32, 32]} position={[0, 2, -3]}>
          <meshStandardMaterial color="#f59e0b" opacity={0.25} transparent />
        </Sphere>
      </Float>
    </>
  )
}

export const JournalBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Environment preset="dawn" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FloatingOrbs />
      </Canvas>
    </div>
  )
}
\`\`\`

### 2. Interactive 3D Elements
Add interactive 3D components that respond to user actions and journal data.

\`\`\`typescript
// components/3d/MoodVisualization.tsx
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Text3D } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface MoodVisualizationProps {
  moodRating: number // 1-5
  energyLevel: number // 1-5
  productivity: number // 1-5
}

const MoodSphere = ({ rating, position, color }: { 
  rating: number
  position: [number, number, number]
  color: string 
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.scale.setScalar(0.5 + (rating / 5) * 0.5)
    }
  })
  
  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
      <meshStandardMaterial 
        color={color} 
        opacity={0.7} 
        transparent 
        emissive={color}
        emissiveIntensity={rating / 10}
      />
    </Sphere>
  )
}

export const MoodVisualization = ({ 
  moodRating, 
  energyLevel, 
  productivity 
}: MoodVisualizationProps) => {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <MoodSphere 
          rating={moodRating} 
          position={[-2, 0, 0]} 
          color="#8b5cf6" 
        />
        <MoodSphere 
          rating={energyLevel} 
          position={[0, 0, 0]} 
          color="#10b981" 
        />
        <MoodSphere 
          rating={productivity} 
          position={[2, 0, 0]} 
          color="#3b82f6" 
        />
        
        <Text3D
          font="/fonts/Geist_Bold.json"
          size={0.3}
          height={0.1}
          position={[-1, -2, 0]}
        >
          Daily Reflection
          <meshStandardMaterial color="#ffffff" />
        </Text3D>
      </Canvas>
    </div>
  )
}
\`\`\`

### 3. Animated 3D Transitions
Create smooth transitions between different 3D states based on user interactions.

\`\`\`typescript
// components/3d/AnimatedScene.tsx
import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'

const AnimatedMesh = ({ targetPosition, targetScale, color }: {
  targetPosition: [number, number, number]
  targetScale: number
  color: string
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        duration: 2,
        ease: "power2.out"
      })
      
      gsap.to(meshRef.current.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)"
      })
    }
  }, [targetPosition, targetScale])
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
\`\`\`

## 🎭 3D Animation Patterns

### 1. Entrance Animations
\`\`\`typescript
const Scene3DEntrance = () => {
  const groupRef = useRef<THREE.Group>(null)
  
  useEffect(() => {
    if (groupRef.current) {
      // Start invisible and scaled down
      groupRef.current.scale.setScalar(0)
      groupRef.current.rotation.y = Math.PI
      
      // Animate entrance
      gsap.timeline()
        .to(groupRef.current.scale, {
          x: 1, y: 1, z: 1,
          duration: 1.5,
          ease: "back.out(1.7)"
        })
        .to(groupRef.current.rotation, {
          y: 0,
          duration: 2,
          ease: "power2.out"
        }, "-=1")
    }
  }, [])
  
  return (
    <group ref={groupRef}>
      {/* 3D content */}
    </group>
  )
}
\`\`\`

### 2. Continuous Animations
\`\`\`typescript
const ContinuousRotation = ({ children }: { children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })
  
  return <group ref={groupRef}>{children}</group>
}
\`\`\`

### 3. Interactive Animations
\`\`\`typescript
const InteractiveMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.2 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
    }
  })
  
  return (
    <mesh
      ref={meshRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={hovered ? "#ff6b6b" : "#4ecdc4"} />
    </mesh>
  )
}
\`\`\`

## 🎨 Foreground vs Background Integration

### Background 3D Elements
**Purpose**: Ambient enhancement without distraction
**Characteristics**:
- Low opacity (0.1-0.3)
- Subtle animations
- Non-interactive
- Fixed positioning

\`\`\`typescript
// Background implementation
<div className="fixed inset-0 -z-10 pointer-events-none">
  <Canvas>
    <ambientLight intensity={0.2} />
    <Environment preset="sunset" />
    {/* Subtle floating elements */}
  </Canvas>
</div>
\`\`\`

### Foreground 3D Elements
**Purpose**: Interactive features and data visualization
**Characteristics**:
- Higher opacity (0.7-1.0)
- Responsive animations
- Interactive capabilities
- Integrated with UI components

\`\`\`typescript
// Foreground implementation
<Card className="glass-card relative overflow-hidden">
  <div className="absolute inset-0">
    <Canvas>
      <MoodVisualization data={journalData} />
    </Canvas>
  </div>
  <CardContent className="relative z-10">
    {/* UI content overlaid on 3D */}
  </CardContent>
</Card>
\`\`\`

## 🔧 Performance Optimization

### 1. Level of Detail (LOD)
\`\`\`typescript
import { Lod } from '@react-three/drei'

const OptimizedMesh = () => (
  <Lod distances={[0, 10, 20]}>
    {/* High detail for close viewing */}
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial />
    </mesh>
    
    {/* Medium detail */}
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial />
    </mesh>
    
    {/* Low detail for distant viewing */}
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial />
    </mesh>
  </Lod>
)
\`\`\`

### 2. Instancing for Multiple Objects
\`\`\`typescript
import { Instances, Instance } from '@react-three/drei'

const ManyOrbs = ({ count = 100 }) => (
  <Instances limit={count} range={count}>
    <sphereGeometry args={[0.1, 16, 16]} />
    <meshStandardMaterial />
    
    {Array.from({ length: count }, (_, i) => (
      <Instance
        key={i}
        position={[
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ]}
        scale={Math.random() * 0.5 + 0.5}
      />
    ))}
  </Instances>
)
\`\`\`

### 3. Conditional Rendering
\`\`\`typescript
const ConditionalScene = ({ showComplex }: { showComplex: boolean }) => {
  return (
    <Canvas>
      {showComplex ? (
        <ComplexScene />
      ) : (
        <SimpleScene />
      )}
    </Canvas>
  )
}
\`\`\`

## 📱 Responsive 3D Design

### Mobile Optimization
\`\`\`typescript
const ResponsiveCanvas = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <Canvas
      camera={{ 
        position: [0, 0, isMobile ? 8 : 5],
        fov: isMobile ? 70 : 50
      }}
      dpr={isMobile ? 1 : 2} // Lower pixel ratio on mobile
    >
      {isMobile ? <SimplifiedScene /> : <FullScene />}
    </Canvas>
  )
}
\`\`\`

### Touch Interactions
\`\`\`typescript
const TouchFriendly3D = () => {
  const [touched, setTouched] = useState(false)
  
  return (
    <mesh
      onPointerDown={() => setTouched(true)}
      onPointerUp={() => setTouched(false)}
      scale={touched ? 1.1 : 1}
    >
      <sphereGeometry />
      <meshStandardMaterial color={touched ? "#ff6b6b" : "#4ecdc4"} />
    </mesh>
  )
}
\`\`\`

## 🎯 Integration Examples

### 1. Mood Ring Visualization
\`\`\`typescript
const MoodRing = ({ mood }: { mood: number }) => {
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01 * mood
    }
  })
  
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2, 0.5, 16, 100]} />
      <meshStandardMaterial 
        color={`hsl(${mood * 60}, 70%, 50%)`}
        emissive={`hsl(${mood * 60}, 70%, 20%)`}
      />
    </mesh>
  )
}
\`\`\`

### 2. Progress Visualization
\`\`\`typescript
const ProgressSphere = ({ progress }: { progress: number }) => {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * progress]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        transparent 
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
\`\`\`

## 🚀 Advanced Techniques

### Shader Materials
\`\`\`typescript
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const WaveShaderMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color(0.2, 0.0, 0.1) },
  // Vertex shader
  `
    varying vec2 vUv;
    uniform float time;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 10.0 + time) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ WaveShaderMaterial })
\`\`\`

### Post-Processing Effects
\`\`\`typescript
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

const PostProcessedScene = () => (
  <Canvas>
    <Scene />
    <EffectComposer>
      <Bloom intensity={0.5} />
      <ChromaticAberration offset={[0.002, 0.002]} />
    </EffectComposer>
  </Canvas>
)
\`\`\`

This comprehensive 3D integration guide provides the foundation for adding immersive 3D elements to the journal application while maintaining performance and usability across all devices.
