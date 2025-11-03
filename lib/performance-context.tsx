'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { detectDeviceCapabilities, getRecommendedDPR, needsPerformanceOptimizations, DeviceCapabilities } from '@/lib/device-detection';

export interface PerformanceSettings {
  // Device capabilities
  deviceCapabilities: DeviceCapabilities;
  
  // DPR settings
  dprRange: [number, number];
  currentDPR: number;
  
  // Performance mode
  lowMode: boolean;
  performanceOptimizationsEnabled: boolean;
  userIgnoredOptimizations: boolean;
  
  // Feature toggles
  enablePostProcessing: boolean;
  enableShadows: boolean;
  enableAntialiasing: boolean;
  
  // Actions
  setCurrentDPR: (dpr: number) => void;
  setLowMode: (lowMode: boolean) => void;
  setUserIgnoredOptimizations: (ignored: boolean) => void;
  togglePerformanceOptimizations: () => void;
}

const PerformanceContext = createContext<PerformanceSettings | null>(null);

interface PerformanceProviderProps {
  children: ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [currentDPR, setCurrentDPR] = useState(1);
  const [lowMode, setLowMode] = useState(false);
  const [userIgnoredOptimizations, setUserIgnoredOptimizations] = useState(false);
  const [performanceOptimizationsEnabled, setPerformanceOptimizationsEnabled] = useState(true);

  // Detect device capabilities on mount
  useEffect(() => {
    const capabilities = detectDeviceCapabilities();
    setDeviceCapabilities(capabilities);
    
    // Check if user has previously ignored optimizations
    const ignored = localStorage.getItem('ignorePerformanceOptimizations') === 'true';
    setUserIgnoredOptimizations(ignored);
    
    // Enable optimizations by default if device needs them and user hasn't ignored
    const shouldOptimize = needsPerformanceOptimizations(capabilities) && !ignored;
    setPerformanceOptimizationsEnabled(shouldOptimize);
  }, []);

  // Save user preference when they ignore optimizations
  useEffect(() => {
    localStorage.setItem('ignorePerformanceOptimizations', String(userIgnoredOptimizations));
  }, [userIgnoredOptimizations]);

  const togglePerformanceOptimizations = () => {
    setPerformanceOptimizationsEnabled(prev => !prev);
  };

  if (!deviceCapabilities) {
    // Return default context while detecting
    return <>{children}</>;
  }

  const dprRange = getRecommendedDPR(deviceCapabilities);
  
  const value: PerformanceSettings = {
    deviceCapabilities,
    dprRange,
    currentDPR,
    lowMode,
    performanceOptimizationsEnabled,
    userIgnoredOptimizations,
    enablePostProcessing: performanceOptimizationsEnabled ? !deviceCapabilities.isLowEnd : true,
    enableShadows: false, // Keep shadows off as per requirements
    enableAntialiasing: performanceOptimizationsEnabled ? false : true,
    setCurrentDPR,
    setLowMode,
    setUserIgnoredOptimizations,
    togglePerformanceOptimizations
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance(): PerformanceSettings {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}
