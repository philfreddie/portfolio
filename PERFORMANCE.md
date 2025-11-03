# Performance Optimizations

This document describes the performance optimizations implemented for the React Three Fiber 3D rendering in the portfolio.

## Overview

The portfolio uses React Three Fiber for 3D rendering with a custom dithering effect. To ensure smooth performance across all devices, we've implemented several performance optimizations that automatically detect device capabilities and adjust rendering quality accordingly.

## Features Implemented

### 1. Device Detection

**File:** `lib/device-detection.ts`

Detects device capabilities including:
- Device memory (RAM)
- CPU cores (hardware concurrency)
- Device pixel ratio
- Mobile vs desktop
- Performance tier (low-end, mid-tier, high-end)

The system classifies devices as:
- **Low-end**: ≤ 4GB RAM, ≤ 2 cores, or high DPR mobile devices
- **Mid-tier**: Everything between low-end and high-end
- **High-end**: > 8GB RAM, > 8 cores, non-mobile devices

### 2. Performance Context

**File:** `lib/performance-context.tsx`

Provides a React context that:
- Manages performance settings globally
- Stores user preferences in localStorage
- Provides recommended DPR ranges based on device
- Toggles for post-processing, shadows, and antialiasing

### 3. Performance Notification

**File:** `components/PerformanceNotification.tsx`

Shows a user-friendly notification when:
- The device needs performance optimizations
- User hasn't made a choice yet

Gives users two options:
- **Enable Optimizations**: Apply performance settings for better frame rates
- **Keep High Quality**: Ignore optimizations (saved to localStorage)

### 4. DPR (Device Pixel Ratio) Clamping

**Implementation:** `components/Dither.tsx`

- Low-end devices: DPR clamped to [1, 1.25]
- Mid-tier devices: DPR clamped to [1, 1.5]
- High-end devices: DPR clamped to [1, 2]

Benefits:
- Reduces GPU load on high-DPI screens
- Maintains acceptable visual quality
- Massive performance improvement on integrated GPUs

### 5. MSAA and Antialiasing Control

**Implementation:** `components/Dither.tsx`

- Antialiasing disabled by default on low/mid-tier devices
- MSAA set to 0 in EffectComposer for low-end devices
- Can be overridden by user preference

Benefits:
- Significant GPU performance improvement
- Minimal visual quality loss due to dithering effect

### 6. Frameloop Control and Visibility Detection

**File:** `lib/performance-hooks.ts` - `useCanvasVisibility`

The Canvas automatically pauses rendering when:
- Browser tab is hidden (using Page Visibility API)
- Canvas scrolled out of viewport (using Intersection Observer)

Benefits:
- Zero GPU usage when not visible
- Huge performance improvement for mostly static scenes
- Better battery life on mobile devices

### 7. Adaptive DPR

**File:** `lib/performance-hooks.ts` - `useAdaptiveDpr`

Automatically adjusts DPR based on real-time FPS:
- Monitors FPS with a 60-frame rolling average
- Lowers DPR when FPS drops below target (55 FPS)
- Gradually increases DPR when performance allows
- Only adjusts every 2 seconds to avoid thrashing

Benefits:
- Keeps UX smooth across all devices
- Automatically adapts to changing conditions
- Provides best quality possible for current performance

### 8. Adaptive Low Mode

**File:** `lib/performance-hooks.ts` - `useAdaptiveLowMode`

Dynamically toggles post-processing effects:
- Disables EffectComposer when FPS < 40
- Re-enables when FPS > 55
- Prevents performance degradation

Benefits:
- Automatic quality scaling
- Maintains minimum acceptable FPS
- Very large impact on low-power devices

### 9. Asset and Code Optimization

**Implementation:** `components/Dither.tsx`

- Memoized geometries and materials to avoid recreations
- Memoized uniforms to prevent per-frame allocations
- Single mouse listener instead of per-component listeners
- Avoided inline object/array creation in props
- `powerPreference: 'high-performance'` for GPU selection

Benefits:
- Reduced JavaScript cost
- Better memory usage
- Smoother frame times

## How It Works

### First Visit

1. Page loads and detects device capabilities
2. If device needs optimization, shows notification after 1 second
3. User can choose to enable optimizations or keep high quality
4. Choice is saved to localStorage

### Subsequent Visits

1. Page loads previous choice from localStorage
2. Applies settings automatically
3. No notification shown

### Runtime Behavior

When optimizations are enabled:
- Canvas uses clamped DPR range
- Antialiasing disabled
- Adaptive DPR monitors and adjusts performance
- Adaptive low mode toggles post-processing
- Frameloop pauses when not visible

When optimizations are disabled:
- Canvas uses higher DPR range
- Antialiasing enabled
- Post-processing always active
- Still pauses when not visible (always beneficial)

## Usage Example

```tsx
import Dither from "@/components/Dither";

// Basic usage (all optimizations automatic)
<Dither
  waveColor={[0.5, 0.5, 0.5]}
  disableAnimation={false}
  enableMouseInteraction={true}
/>

// With explicit performance settings
<Dither
  waveColor={[0.5, 0.5, 0.5]}
  enablePostProcessing={true}
  enableAdaptivePerformance={true}
  dprRange={[1, 1.5]}
  enableAntialiasing={false}
/>
```

## Performance Impact

Expected improvements on integrated GPUs:

1. **DPR Clamping**: 40-60% faster rendering
2. **MSAA Disabled**: 20-30% improvement
3. **Frameloop Control**: ~100% when not visible
4. **Adaptive DPR**: Maintains target FPS automatically
5. **Post-processing Toggle**: 30-50% when disabled

Combined effect: Portfolio is now usable on low-end devices that previously couldn't handle it.

## Browser Compatibility

- Device Memory API: Chrome, Edge, Opera
- Hardware Concurrency: All modern browsers
- Page Visibility API: All modern browsers
- Intersection Observer: All modern browsers
- Fallbacks provided when APIs unavailable

## Future Enhancements

Possible improvements:
1. Texture compression (KTX2/Basis)
2. Model LOD (Level of Detail) system
3. Progressive loading
4. WebGPU support for better performance
5. More granular quality tiers
