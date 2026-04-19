# 🎬 Advanced Motion Design Specification

## Chikitsāmedhā - Next-Generation UI Animation System

**Version**: 2.0
**Date**: 2026-02-14
**Status**: Production-Ready Specification

---

## 📋 Executive Summary

This document defines a **next-generation, context-aware motion design system** that transforms every UI interaction into a meaningful, functional animation. Each motion serves a clear purpose: providing feedback, indicating state changes, guiding attention, or enhancing comprehension.

### Core Principles

1. **Purposeful Motion** - Every animation has a functional reason
2. **Performance First** - 60 FPS minimum, GPU-accelerated
3. **Context Awareness** - Animations adapt to user state and data
4. **Accessibility** - Respects reduced motion preferences
5. **Consistency** - Unified timing, easing, and behavior

---

## 🎯 1. Next-Generation Motion Design System

### 1.1 Motion Hierarchy

#### **Tier 1: Micro-Interactions (50-150ms)**

**Purpose**: Immediate feedback for user actions
**Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` - Material Design Standard

| Element | Duration | Trigger | Purpose | Implementation |
|---------|----------|---------|---------|----------------|
| Button Press | 50ms | Click/Tap | Tactile feedback | Scale 0.98, brightness -5% |
| Checkbox Toggle | 100ms | Click | State confirmation | Checkmark draw + background fill |
| Radio Select | 120ms | Click | Selection feedback | Ripple from center + fill |
| Switch Toggle | 150ms | Click | Binary state change | Slide + color morph |
| Input Focus | 100ms | Focus | Attention direction | Border glow + scale 1.01 |
| Tooltip Appear | 80ms | Hover (300ms delay) | Information reveal | Fade + slide 4px |

**Video Mockup Spec**: 3-second loop showing all Tier 1 interactions in sequence

- **Keyframes**: 0s (idle), 0.5s (button), 1s (checkbox), 1.5s (radio), 2s (switch), 2.5s (input)

#### **Tier 2: Component Transitions (200-400ms)**

**Purpose**: State changes and content updates
**Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` with anticipation

| Element | Duration | Trigger | Purpose | Implementation |
|---------|----------|---------|---------|----------------|
| Card Expand | 300ms | Click | Content reveal | Height + opacity children |
| Modal Open | 350ms | Trigger | Focus shift | Scale 0.9→1 + backdrop fade |
| Modal Close | 250ms | Dismiss | Return to context | Scale 1→0.95 + fade |
| Dropdown Open | 200ms | Click | Options reveal | Height + stagger children 20ms |
| Tab Switch | 300ms | Click | Content swap | Slide out + slide in |
| Accordion Toggle | 280ms | Click | Section reveal | Height + rotate chevron 180° |
| Toast Notification | 350ms | Event | Alert user | Slide from edge + bounce |

**Context-Aware Behavior**:

- **Success**: Green accent, gentle bounce (spring physics)
- **Error**: Red accent, shake animation (3 oscillations)
- **Warning**: Amber accent, pulse effect
- **Info**: Blue accent, smooth slide

#### **Tier 3: Page Transitions (400-600ms)**

**Purpose**: Navigation and major state changes
**Easing**: Custom spring physics `(tension: 300, friction: 30)`

| Transition | Duration | Trigger | Purpose | Implementation |
|------------|----------|---------|---------|----------------|
| Route Change | 500ms | Navigation | Context shift | Crossfade + slide 20px |
| Section Scroll | 450ms | Scroll/Click | Smooth navigation | Ease-in-out scroll |
| Data Load | 400ms | API response | Content reveal | Skeleton → content morph |
| Filter Apply | 380ms | User action | Results update | Stagger fade-out/in |
| Sort Change | 420ms | User action | Reorder items | Position morph with FLIP |

**FLIP Technique** (First, Last, Invert, Play):

```javascript
// Measure before (First)
const first = element.getBoundingClientRect()
// Apply change (Last)
applySort()
const last = element.getBoundingClientRect()
// Calculate delta (Invert)
const deltaX = first.left - last.left
const deltaY = first.top - last.top
// Animate (Play)
element.animate([
  { transform: `translate(${deltaX}px, ${deltaY}px)` },
  { transform: 'translate(0, 0)' }
], { duration: 420, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' })
```

#### **Tier 4: Ambient Animations (2000ms+)**

**Purpose**: Visual interest and brand identity
**Easing**: `linear` or `ease-in-out` for loops

| Element | Duration | Trigger | Purpose | Implementation |
|---------|----------|---------|---------|----------------|
| Particle System | 15s loop | Page load | Atmosphere | Continuous float |
| Gradient Shift | 8s loop | Always | Visual depth | Background position |
| Blob Float | 20s loop | Always | Organic motion | Transform with noise |
| Grid Drift | 20s loop | Always | Subtle movement | Background position |
| Pulse Glow | 2s loop | Idle state | Attention | Box-shadow expand |

---

### 1.2 Context-Aware Motion Patterns

#### **Pattern A: Data-Driven Animations**

**Risk Level Indicator**

```typescript
interface RiskAnimation {
  level: 'low' | 'moderate' | 'high' | 'contraindicated'
  duration: number
  easing: string
  effects: AnimationEffect[]
}

const riskAnimations: Record<string, RiskAnimation> = {
  low: {
    level: 'low',
    duration: 600,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bounce
    effects: [
      { type: 'scale', from: 0.8, to: 1 },
      { type: 'opacity', from: 0, to: 1 },
      { type: 'glow', color: '#0EA47A', intensity: 0.3 }
    ]
  },
  moderate: {
    level: 'moderate',
    duration: 500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    effects: [
      { type: 'scale', from: 0.9, to: 1 },
      { type: 'opacity', from: 0, to: 1 },
      { type: 'glow', color: '#F59E0B', intensity: 0.4 },
      { type: 'pulse', frequency: 2000 }
    ]
  },
  high: {
    level: 'high',
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    effects: [
      { type: 'shake', amplitude: 4, frequency: 3 },
      { type: 'scale', from: 1.1, to: 1 },
      { type: 'opacity', from: 0, to: 1 },
      { type: 'glow', color: '#EF4444', intensity: 0.6 }
    ]
  },
  contraindicated: {
    level: 'contraindicated',
    duration: 350,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    effects: [
      { type: 'shake', amplitude: 6, frequency: 4 },
      { type: 'scale', from: 1.15, to: 1 },
      { type: 'opacity', from: 0, to: 1 },
      { type: 'glow', color: '#DC2626', intensity: 0.8 },
      { type: 'border-pulse', color: '#DC2626' }
    ]
  }
}
```

**Video Mockup Spec**: 8-second sequence showing risk level reveals

- **0-2s**: Low risk (gentle bounce, green glow)
- **2-4s**: Moderate risk (pulse, amber glow)
- **4-6s**: High risk (shake, red glow)
- **6-8s**: Contraindicated (intense shake, red border pulse)

#### **Pattern B: Loading State Choreography**

**Progressive Loading Sequence**

```typescript
interface LoadingStage {
  stage: number
  duration: number
  elements: LoadingElement[]
}

const loadingChoreography: LoadingStage[] = [
  {
    stage: 1, // Initial skeleton
    duration: 0,
    elements: [
      { id: 'header-skeleton', animation: 'shimmer', delay: 0 },
      { id: 'card-skeleton-1', animation: 'shimmer', delay: 50 },
      { id: 'card-skeleton-2', animation: 'shimmer', delay: 100 },
      { id: 'card-skeleton-3', animation: 'shimmer', delay: 150 }
    ]
  },
  {
    stage: 2, // Data arrives
    duration: 400,
    elements: [
      { id: 'header', animation: 'morph-from-skeleton', delay: 0 },
      { id: 'card-1', animation: 'morph-from-skeleton', delay: 50 },
      { id: 'card-2', animation: 'morph-from-skeleton', delay: 100 },
      { id: 'card-3', animation: 'morph-from-skeleton', delay: 150 }
    ]
  },
  {
    stage: 3, // Content reveal
    duration: 300,
    elements: [
      { id: 'card-1-details', animation: 'fade-slide-up', delay: 0 },
      { id: 'card-2-details', animation: 'fade-slide-up', delay: 80 },
      { id: 'card-3-details', animation: 'fade-slide-up', delay: 160 }
    ]
  }
]
```

**Skeleton-to-Content Morph**:

- Skeleton maintains exact dimensions
- Content fades in while skeleton fades out (crossfade)
- Slight scale pulse (0.98 → 1) on content appearance
- Duration: 400ms per element

#### **Pattern C: Attention Direction**

**Sequential Focus Animation**

```typescript
interface AttentionSequence {
  steps: AttentionStep[]
  totalDuration: number
}

const onboardingSequence: AttentionSequence = {
  steps: [
    {
      target: '#profile-section',
      animation: 'spotlight-pulse',
      duration: 2000,
      message: 'Enter your health profile',
      effects: [
        { type: 'backdrop-dim', opacity: 0.7 },
        { type: 'spotlight', radius: 200, glow: true },
        { type: 'pulse-ring', color: '#0EA47A', count: 3 }
      ]
    },
    {
      target: '#medicine-search',
      animation: 'spotlight-pulse',
      duration: 2000,
      message: 'Search for medicines',
      effects: [
        { type: 'backdrop-dim', opacity: 0.7 },
        { type: 'spotlight', radius: 180, glow: true },
        { type: 'pulse-ring', color: '#0EA47A', count: 3 },
        { type: 'arrow-point', from: '#profile-section' }
      ]
    },
    {
      target: '#check-button',
      animation: 'spotlight-pulse',
      duration: 2000,
      message: 'Analyze interactions',
      effects: [
        { type: 'backdrop-dim', opacity: 0.7 },
        { type: 'spotlight', radius: 150, glow: true },
        { type: 'pulse-ring', color: '#0EA47A', count: 3 },
        { type: 'button-breathe', scale: [1, 1.05, 1] }
      ]
    }
  ],
  totalDuration: 6000
}
```

---

### 1.3 Functional Animation Justifications

| Animation | Functional Purpose | Usability Benefit | Performance Cost |
|-----------|-------------------|-------------------|------------------|
| **Button Ripple** | Confirms click location | Reduces uncertainty | Low (GPU) |
| **Card Lift on Hover** | Indicates interactivity | Improves discoverability | Low (transform) |
| **Loading Skeleton** | Shows content structure | Reduces perceived wait | Low (CSS) |
| **Shake on Error** | Draws attention to problem | Faster error recognition | Low (transform) |
| **Smooth Scroll** | Maintains spatial context | Reduces disorientation | Medium (scroll) |
| **Stagger Reveal** | Guides reading order | Improves comprehension | Low (opacity) |
| **Color Morph** | Indicates state change | Clear visual feedback | Low (GPU) |
| **Pulse Glow** | Highlights important action | Directs attention | Low (box-shadow) |
| **FLIP Reorder** | Shows item movement | Maintains mental model | Medium (FLIP calc) |
| **Modal Scale** | Indicates hierarchy | Shows focus shift | Low (transform) |

---

## 🎨 2. High-Fidelity 2D/3D Graphical Integration

### 2.1 3D Transform Applications

#### **Use Case 1: Card Flip for Medicine Details**

**Justification**:

- Shows front/back relationship clearly
- Saves screen space (no modal needed)
- Engaging interaction for detailed info

**Implementation**:

```css
.medicine-card {
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.medicine-card.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
}

.card-back {
  transform: rotateY(180deg);
}
```

**Performance**:

- GPU-accelerated (transform3d)
- 60 FPS on modern devices
- Fallback: Crossfade on low-end devices

**Video Mockup Spec**: 4-second demonstration

- **0-0.6s**: Card flips to show back (medicine details)
- **0.6-2s**: User reads back content
- **2-2.6s**: Card flips back to front
- **2.6-4s**: Idle state

#### **Use Case 2: 3D Meter Visualization**

**Justification**:

- More engaging than flat progress bar
- Better depth perception for risk levels
- Memorable visual for critical information

**Implementation**:

```typescript
// Using CSS 3D transforms for cylindrical meter
interface Meter3D {
  value: number // 0-100
  color: string
  label: string
}

const render3DMeter = (meter: Meter3D) => {
  const rotation = (meter.value / 100) * 180 - 90 // -90° to 90°
  return `
    <div class="meter-3d" style="transform: rotateX(${rotation}deg)">
      <div class="meter-fill" style="background: ${meter.color}"></div>
      <div class="meter-label">${meter.label}: ${meter.value}%</div>
    </div>
  `
}
```

**Performance**:

- Uses CSS transforms (GPU)
- No WebGL overhead
- Degrades to 2D on reduced motion

#### **Use Case 3: Parallax Depth Layers**

**Justification**:

- Creates visual hierarchy
- Guides eye through content
- Adds premium feel without complexity

**Implementation**:

```typescript
const parallaxLayers = [
  { selector: '.blob-layer-1', speed: 0.2, depth: -100 },
  { selector: '.blob-layer-2', speed: 0.4, depth: -50 },
  { selector: '.content-layer', speed: 1, depth: 0 },
  { selector: '.particle-layer', speed: 1.5, depth: 50 }
]

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY
  parallaxLayers.forEach(layer => {
    const element = document.querySelector(layer.selector)
    const offset = scrollY * (1 - layer.speed)
    element.style.transform = `translateY(${offset}px) translateZ(${layer.depth}px)`
  })
})
```

**Performance**:

- RequestAnimationFrame throttling
- Transform-only (no layout thrashing)
- Disabled on mobile for battery

**Video Mockup Spec**: 6-second scroll demonstration

- **0-3s**: Slow scroll down showing parallax separation
- **3-6s**: Scroll back up showing reverse parallax

---

### 2.2 Advanced 2D Graphics

#### **SVG Morphing for Icons**

**Use Case**: State change indicators (e.g., checkmark → cross)

**Implementation**:

```html
<svg viewBox="0 0 24 24">
  <path id="morph-path" d="M5 12l5 5L20 7">
    <animate
      attributeName="d"
      from="M5 12l5 5L20 7"
      to="M5 5l14 14M19 5L5 19"
      dur="300ms"
      fill="freeze"
      begin="click"
    />
  </path>
</svg>
```

**Justification**:

- Smooth state transitions
- Clear visual feedback
- Small file size (vector)

#### **Canvas-Based Particle System**

**Justification**:

- More particles (100+) than CSS
- Physics-based motion
- Interactive (mouse repulsion)

**Implementation**:

```typescript
class ParticleSystem {
  private particles: Particle[] = []
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  
  constructor(count: number) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
    this.particles = Array.from({ length: count }, () => new Particle())
  }
  
  update(deltaTime: number) {
    this.particles.forEach(p => {
      p.update(deltaTime)
      p.applyForce({ x: 0, y: -0.1 }) // Upward drift
      p.checkBounds(this.canvas.width, this.canvas.height)
    })
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.particles.forEach(p => p.draw(this.ctx))
  }
  
  animate = () => {
    this.update(16.67) // 60 FPS
    this.render()
    requestAnimationFrame(this.animate)
  }
}
```

**Performance**:

- Offscreen canvas for better performance
- Particle pooling (no GC)
- Adaptive particle count based on FPS

**Video Mockup Spec**: 10-second loop

- **0-5s**: Particles drift upward naturally
- **5-10s**: Mouse moves through, particles repel and return

---

### 2.3 WebGL Integration (Optional Enhancement)

**Use Case**: Medical visualization (molecule structure, interaction graph)

**Justification**:

- Complex 3D data visualization
- Smooth 60 FPS with many objects
- Interactive rotation/zoom

**Implementation** (Three.js):

```typescript
import * as THREE from 'three'

class MoleculeVisualization {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  
  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    this.setupLights()
    this.createMolecule()
    this.animate()
  }
  
  createMolecule() {
    // Atoms as spheres
    const atomGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const atomMaterial = new THREE.MeshPhongMaterial({ color: 0x0EA47A })
    
    // Bonds as cylinders
    const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2)
    const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xCCCCCC })
    
    // Add to scene with positions from data
  }
  
  animate = () => {
    this.scene.rotation.y += 0.005 // Slow rotation
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate)
  }
}
```

**Performance**:

- Lazy load (only when needed)
- Low poly models (<1000 vertices)
- Fallback to 2D diagram

**When to Use**:

- ✅ Complex spatial relationships
- ✅ Interactive exploration needed
- ❌ Simple data (use 2D instead)
- ❌ Mobile devices (battery concern)

---

## 🎨 3. Complete UI Overhaul - Design System

### 3.1 Motion Design Tokens

```typescript
export const motionTokens = {
  // Durations
  duration: {
    instant: 50,
    fast: 100,
    normal: 200,
    moderate: 300,
    slow: 400,
    slower: 600,
    slowest: 800
  },
  
  // Easing curves
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  // Spring physics
  spring: {
    gentle: { tension: 120, friction: 14 },
    normal: { tension: 170, friction: 26 },
    wobbly: { tension: 180, friction: 12 },
    stiff: { tension: 300, friction: 30 }
  },
  
  // Delays
  delay: {
    none: 0,
    short: 50,
    medium: 100,
    long: 200
  },
  
  // Stagger
  stagger: {
    tight: 20,
    normal: 50,
    loose: 100
  }
}
```

### 3.2 Component Animation Specifications

#### **Button Component**

```typescript
interface ButtonAnimation {
  idle: AnimationState
  hover: AnimationState
  active: AnimationState
  disabled: AnimationState
}

const buttonAnimations: ButtonAnimation = {
  idle: {
    scale: 1,
    brightness: 1,
    shadow: '0 4px 16px rgba(0,0,0,0.1)',
    duration: 0
  },
  hover: {
    scale: 1.02,
    brightness: 1.05,
    shadow: '0 8px 24px rgba(14,164,122,0.25)',
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  active: {
    scale: 0.98,
    brightness: 0.95,
    shadow: '0 2px 8px rgba(0,0,0,0.15)',
    duration: 50,
    easing: 'cubic-bezier(0.4, 0, 1, 1)'
  },
  disabled: {
    scale: 1,
    brightness: 0.6,
    shadow: 'none',
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}
```

**Ripple Effect**:

```typescript
const createRipple = (event: MouseEvent, button: HTMLElement) => {
  const rect = button.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const ripple = document.createElement('span')
  ripple.className = 'ripple'
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  
  button.appendChild(ripple)
  
  ripple.animate([
    { transform: 'scale(0)', opacity: 0.6 },
    { transform: 'scale(4)', opacity: 0 }
  ], {
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }).onfinish = () => ripple.remove()
}
```

#### **Card Component**

```typescript
const cardAnimations = {
  entrance: {
    keyframes: [
      { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ],
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  hover: {
    keyframes: [
      { transform: 'translateY(0) scale(1)' },
      { transform: 'translateY(-8px) scale(1.01)' }
    ],
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fill: 'forwards'
  },
  
  expand: {
    keyframes: [
      { height: 'auto', opacity: 0 },
      { height: 'auto', opacity: 1 }
    ],
    duration: 350,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}
```

#### **Modal Component**

```typescript
const modalAnimations = {
  open: {
    backdrop: {
      keyframes: [
        { opacity: 0 },
        { opacity: 1 }
      ],
      duration: 250,
      easing: 'cubic-bezier(0, 0, 0.2, 1)'
    },
    content: {
      keyframes: [
        { opacity: 0, transform: 'scale(0.9) translateY(20px)' },
        { opacity: 1, transform: 'scale(1) translateY(0)' }
      ],
      duration: 350,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bounce
      delay: 100
    }
  },
  
  close: {
    backdrop: {
      keyframes: [
        { opacity: 1 },
        { opacity: 0 }
      ],
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 1, 1)',
      delay: 100
    },
    content: {
      keyframes: [
        { opacity: 1, transform: 'scale(1) translateY(0)' },
        { opacity: 0, transform: 'scale(0.95) translateY(10px)' }
      ],
      duration: 250,
      easing: 'cubic-bezier(0.4, 0, 1, 1)'
    }
  }
}
```

---

### 3.3 Page-Level Choreography

#### **Home Page Load Sequence**

```typescript
const homePageChoreography = {
  totalDuration: 2000,
  stages: [
    {
      name: 'Background Elements',
      startTime: 0,
      elements: [
        { id: 'particles', animation: 'fade-in', duration: 800, delay: 0 },
        { id: 'blob-1', animation: 'scale-fade', duration: 1000, delay: 100 },
        { id: 'blob-2', animation: 'scale-fade', duration: 1000, delay: 200 },
        { id: 'grid', animation: 'fade-in', duration: 600, delay: 0 }
      ]
    },
    {
      name: 'Hero Content',
      startTime: 300,
      elements: [
        { id: 'hero-badge', animation: 'slide-fade-up', duration: 400, delay: 0 },
        { id: 'hero-title', animation: 'slide-fade-up', duration: 500, delay: 100 },
        { id: 'hero-description', animation: 'slide-fade-up', duration: 500, delay: 200 },
        { id: 'hero-cta-primary', animation: 'scale-fade', duration: 400, delay: 300 },
        { id: 'hero-cta-secondary', animation: 'scale-fade', duration: 400, delay: 350 }
      ]
    },
    {
      name: 'Stats Row',
      startTime: 800,
      elements: [
        { id: 'stat-1', animation: 'count-up', duration: 1000, delay: 0 },
        { id: 'stat-2', animation: 'count-up', duration: 1000, delay: 100 },
        { id: 'stat-3', animation: 'count-up', duration: 1000, delay: 200 }
      ]
    },
    {
      name: 'Feature Cards',
      startTime: 1000,
      elements: [
        { id: 'feature-1', animation: 'slide-fade-up', duration: 500, delay: 0 },
        { id: 'feature-2', animation: 'slide-fade-up', duration: 500, delay: 100 },
        { id: 'feature-3', animation: 'slide-fade-up', duration: 500, delay: 200 }
      ]
    }
  ]
}
```

**Video Mockup Spec**: 3-second page load sequence

- **0-0.8s**: Background fades in, particles appear
- **0.3-1.2s**: Hero content slides up in sequence
- **0.8-1.8s**: Stats count up from 0
- **1.0-1.7s**: Feature cards slide up with stagger

---

### 3.4 Interaction State Machine

```typescript
type InteractionState = 'idle' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading' | 'success' | 'error'

interface StateTransition {
  from: InteractionState
  to: InteractionState
  animation: Animation
  duration: number
}

const stateTransitions: StateTransition[] = [
  {
    from: 'idle',
    to: 'hover',
    animation: { scale: 1.02, shadow: 'elevated' },
    duration: 200
  },
  {
    from: 'hover',
    to: 'active',
    animation: { scale: 0.98, shadow: 'pressed' },
    duration: 50
  },
  {
    from: 'active',
    to: 'loading',
    animation: { spinner: 'fade-in', text: 'fade-out' },
    duration: 200
  },
  {
    from: 'loading',
    to: 'success',
    animation: { 
      spinner: 'morph-to-checkmark',
      background: 'color-morph-green',
      scale: [1, 1.05, 1]
    },
    duration: 400
  },
  {
    from: 'loading',
    to: 'error',
    animation: {
      spinner: 'morph-to-cross',
      background: 'color-morph-red',
      shake: { amplitude: 4, frequency: 3 }
    },
    duration: 350
  }
]
```

---

## 📊 4. Performance Budget

| Animation Type | Max Duration | FPS Target | GPU Usage | CPU Usage |
|----------------|--------------|------------|-----------|-----------|
| Micro-interaction | 150ms | 60 | <5% | <10% |
| Component transition | 400ms | 60 | <10% | <15% |
| Page transition | 600ms | 60 | <15% | <20% |
| Ambient animation | Continuous | 60 | <8% | <12% |
| 3D transform | 600ms | 60 | <20% | <15% |
| Canvas particle | Continuous | 60 | <25% | <20% |
| WebGL (optional) | Continuous | 60 | <40% | <25% |

**Monitoring**:

```typescript
const performanceMonitor = {
  fps: 0,
  frameTime: 0,
  
  measure() {
    let lastTime = performance.now()
    let frames = 0
    
    const loop = () => {
      const now = performance.now()
      frames++
      
      if (now >= lastTime + 1000) {
        this.fps = Math.round((frames * 1000) / (now - lastTime))
        this.frameTime = (now - lastTime) / frames
        
        if (this.fps < 50) {
          console.warn('Low FPS detected:', this.fps)
          this.reduceAnimations()
        }
        
        frames = 0
        lastTime = now
      }
      
      requestAnimationFrame(loop)
    }
    
    loop()
  },
  
  reduceAnimations() {
    // Disable ambient animations
    document.body.classList.add('reduce-animations')
    // Reduce particle count
    particleSystem.setCount(10)
    // Disable 3D transforms
    document.body.classList.add('no-3d')
  }
}
```

---

## 🎬 5. Video Mockup Specifications

### Video 1: Complete User Journey (30 seconds)

**Purpose**: Show end-to-end experience with all animations

**Timeline**:

- **0-3s**: Page load with choreographed entrance
- **3-6s**: User hovers over feature cards (3D lift)
- **6-9s**: User clicks "Start Check" (ripple + navigation)
- **9-12s**: Medicine search with autocomplete animations
- **12-15s**: Add medicine (card flip to show details)
- **15-18s**: Click "Analyze" button (loading → success)
- **18-24s**: Results appear with risk level animation (shake for high risk)
- **24-27s**: Scroll through results (parallax depth)
- **27-30s**: Download PDF (button state changes)

**Key Frames**:

- 0s: Blank screen
- 0.3s: Background visible
- 0.8s: Hero content visible
- 3s: Idle state
- 6s: Navigation transition starts
- 9s: Search page loaded
- 15s: Loading state
- 18s: Results visible
- 24s: Scrolling
- 30s: Final state

### Video 2: Micro-Interaction Showcase (10 seconds)

**Purpose**: Demonstrate all micro-interactions in rapid succession

**Timeline**:

- **0-1s**: Button press (ripple)
- **1-2s**: Checkbox toggle (checkmark draw)
- **2-3s**: Switch toggle (slide + color)
- **3-4s**: Input focus (glow + scale)
- **4-5s**: Dropdown open (height + stagger)
- **5-6s**: Tooltip appear (fade + slide)
- **6-7s**: Card hover (lift + glow)
- **7-8s**: Modal open (scale + backdrop)
- **8-9s**: Tab switch (slide transition)
- **9-10s**: Toast notification (slide + bounce)

### Video 3: Loading States (8 seconds)

**Purpose**: Show skeleton → content transitions

**Timeline**:

- **0-2s**: Skeleton shimmer animation
- **2-4s**: First card morphs from skeleton to content
- **4-6s**: Second card morphs (staggered)
- **6-8s**: Third card morphs (staggered)

### Video 4: Risk Level Animations (8 seconds)

**Purpose**: Demonstrate context-aware animations

**Timeline**:

- **0-2s**: Low risk (gentle bounce, green glow)
- **2-4s**: Moderate risk (pulse, amber glow)
- **4-6s**: High risk (shake, red glow)
- **6-8s**: Contraindicated (intense shake, red border pulse)

### Video 5: 3D Interactions (6 seconds)

**Purpose**: Show 3D transform capabilities

**Timeline**:

- **0-3s**: Card flip to reveal back
- **3-6s**: Card flip back to front

---

## 📐 6. Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Implement motion design tokens
- [ ] Create animation utility functions
- [ ] Set up performance monitoring
- [ ] Establish reduced motion fallbacks

### Phase 2: Micro-Interactions (Week 2)

- [ ] Button ripple effect
- [ ] Input focus animations
- [ ] Checkbox/radio animations
- [ ] Tooltip animations
- [ ] Hover state polish

### Phase 3: Component Transitions (Week 3)

- [ ] Modal open/close
- [ ] Dropdown animations
- [ ] Tab switching
- [ ] Card expand/collapse
- [ ] Toast notifications

### Phase 4: Page Choreography (Week 4)

- [ ] Home page load sequence
- [ ] Route transitions
- [ ] Scroll-based reveals
- [ ] Loading state choreography
- [ ] Error state animations

### Phase 5: Advanced Features (Week 5)

- [ ] 3D card flip
- [ ] Parallax depth layers
- [ ] Canvas particle system
- [ ] SVG morphing
- [ ] FLIP animations

### Phase 6: Polish & Optimization (Week 6)

- [ ] Performance tuning
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] Animation documentation
- [ ] Video mockup creation

---

## 🎯 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Animation FPS | ≥60 | Performance API |
| Page load time | <2s | Lighthouse |
| Time to interactive | <3s | Lighthouse |
| Perceived performance | +30% | User survey |
| Engagement rate | +20% | Analytics |
| Error recognition time | -40% | User testing |
| Task completion rate | +15% | A/B testing |

---

**Document Version**: 2.0
**Last Updated**: 2026-02-14
**Status**: Ready for Implementation
