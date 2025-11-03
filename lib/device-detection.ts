/**
 * Device detection utilities for performance optimization
 */

export interface DeviceCapabilities {
  isLowEnd: boolean;
  isMidTier: boolean;
  isHighEnd: boolean;
  deviceMemory: number | null;
  hardwareConcurrency: number;
  maxTouchPoints: number;
  isMobile: boolean;
  devicePixelRatio: number;
}

/**
 * Detect device capabilities and performance tier
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  // Get device memory (in GB) - only available in some browsers
  const deviceMemory = (navigator as any).deviceMemory || null;
  
  // Get number of logical processors
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  
  // Check if it's a mobile device
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isMobile = maxTouchPoints > 0 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // Get device pixel ratio
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Determine performance tier
  // Low-end: <= 4GB RAM, <= 2 cores, or high DPR on mobile
  const isLowEnd = 
    (deviceMemory !== null && deviceMemory <= 4) ||
    hardwareConcurrency <= 2 ||
    (isMobile && devicePixelRatio > 2);
  
  // High-end: > 8GB RAM, > 8 cores
  const isHighEnd = 
    (deviceMemory !== null && deviceMemory > 8) &&
    hardwareConcurrency > 8 &&
    !isMobile;
  
  // Mid-tier: everything else
  const isMidTier = !isLowEnd && !isHighEnd;
  
  return {
    isLowEnd,
    isMidTier,
    isHighEnd,
    deviceMemory,
    hardwareConcurrency,
    maxTouchPoints,
    isMobile,
    devicePixelRatio
  };
}

/**
 * Get recommended DPR range based on device capabilities
 */
export function getRecommendedDPR(capabilities: DeviceCapabilities): [number, number] {
  if (capabilities.isLowEnd) {
    return [1, 1.25]; // Very conservative for low-end devices
  } else if (capabilities.isMidTier) {
    return [1, 1.5]; // Moderate for mid-tier
  } else {
    return [1, 2]; // Allow higher DPR for high-end devices
  }
}

/**
 * Check if device needs performance optimizations
 */
export function needsPerformanceOptimizations(capabilities: DeviceCapabilities): boolean {
  return capabilities.isLowEnd || capabilities.isMidTier;
}
