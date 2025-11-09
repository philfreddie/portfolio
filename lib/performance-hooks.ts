'use client';

import { useEffect, useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * Hook to adaptively adjust DPR based on FPS
 */
export function useAdaptiveDpr(
  targetFps = 55,
  minDpr = 1,
  maxDpr = 1.5,
  enabled = true
) {
  const { gl } = useThree();
  const [dpr, setDpr] = useState(maxDpr);
  const fpsHistoryRef = useRef<number[]>([]);
  const lastAdjustmentRef = useRef(0);

  useFrame((state) => {
    if (!enabled) return;

    const now = state.clock.getElapsedTime();
    const fps = 1 / state.clock.getDelta();
    
    // Keep a rolling history of FPS (last 60 frames)
    fpsHistoryRef.current.push(fps);
    if (fpsHistoryRef.current.length > 60) {
      fpsHistoryRef.current.shift();
    }

    // Only adjust DPR every 2 seconds to avoid thrashing
    if (now - lastAdjustmentRef.current < 2) return;

    // Calculate average FPS over the history
    const avgFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;

    // Adjust DPR based on performance
    if (avgFps < targetFps - 10 && dpr > minDpr) {
      const next = Math.max(minDpr, dpr - 0.1);
      setDpr(next);
      gl.setPixelRatio(next);
      lastAdjustmentRef.current = now;
      console.log(`🔽 DPR lowered to ${next.toFixed(2)} (FPS: ${avgFps.toFixed(1)})`);
    } else if (avgFps > targetFps + 10 && dpr < maxDpr) {
      const next = Math.min(maxDpr, dpr + 0.05);
      setDpr(next);
      gl.setPixelRatio(next);
      lastAdjustmentRef.current = now;
      console.log(`🔼 DPR increased to ${next.toFixed(2)} (FPS: ${avgFps.toFixed(1)})`);
    }
  });

  return dpr;
}

/**
 * Hook to adaptively toggle low mode based on FPS
 */
export function useAdaptiveLowMode(
  targetFps = 40,
  recoveryFps = 55,
  enabled = true
) {
  const [lowMode, setLowMode] = useState(false);
  const fpsHistoryRef = useRef<number[]>([]);
  const lastAdjustmentRef = useRef(0);

  useFrame((state) => {
    if (!enabled) return;

    const now = state.clock.getElapsedTime();
    const fps = 1 / state.clock.getDelta();
    
    // Keep a rolling history
    fpsHistoryRef.current.push(fps);
    if (fpsHistoryRef.current.length > 60) {
      fpsHistoryRef.current.shift();
    }

    // Only check every second
    if (now - lastAdjustmentRef.current < 1) return;

    const avgFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;

    if (avgFps < targetFps && !lowMode) {
      setLowMode(true);
      lastAdjustmentRef.current = now;
      console.log(`⚠️ Low mode enabled (FPS: ${avgFps.toFixed(1)})`);
    } else if (avgFps > recoveryFps && lowMode) {
      setLowMode(false);
      lastAdjustmentRef.current = now;
      console.log(`✅ Low mode disabled (FPS: ${avgFps.toFixed(1)})`);
    }
  });

  return lowMode;
}

/**
 * Hook to detect if the canvas is visible (tab visibility + intersection observer)
 */
export function useCanvasVisibility(
  canvasRef?: React.RefObject<HTMLDivElement | null>,
  threshold = 0.05
) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Tab visibility
    const onVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    onVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // Intersection Observer for scrolling
    if (!canvasRef?.current) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    io.observe(canvasRef.current);

    return () => {
      io.disconnect();
    };
  }, [canvasRef, threshold]);

  return isVisible;
}
