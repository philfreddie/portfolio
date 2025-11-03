'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Settings, Zap, Shield } from 'lucide-react';

interface PerformanceToggleProps {
  currentMode: 'high' | 'low';
  onModeChange: (mode: 'high' | 'low') => void;
}

export function PerformanceToggle({ currentMode, onModeChange }: PerformanceToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleModeSelect = (mode: 'high' | 'low') => {
    onModeChange(mode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <Button
        size="icon"
        className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Performance settings"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border overflow-hidden z-[100] animate-in slide-in-from-top-2 fade-in">
          <div className="p-3 border-b border-border bg-muted/50">
            <h3 className="text-sm font-semibold">Performance Mode</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Choose your preferred rendering quality</p>
          </div>

          <div className="p-2">
            {/* High Performance Option */}
            <button
              onClick={() => handleModeSelect('high')}
              className={`w-full flex items-start gap-3 p-3 rounded-md transition-all ${
                currentMode === 'high'
                  ? 'bg-accent text-accent-foreground border border-border'
                  : 'hover:bg-accent/50 border border-transparent'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                currentMode === 'high' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Zap className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    High Quality
                  </span>
                  {currentMode === 'high' && (
                    <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Maximum visual quality with full post-processing effects and higher resolution. Best for powerful devices.
                </p>
              </div>
            </button>

            {/* Low Performance Option */}
            <button
              onClick={() => handleModeSelect('low')}
              className={`w-full flex items-start gap-3 p-3 rounded-md transition-all mt-2 ${
                currentMode === 'low'
                  ? 'bg-accent text-accent-foreground border border-border'
                  : 'hover:bg-accent/50 border border-transparent'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                currentMode === 'low' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    Optimized Performance
                  </span>
                  {currentMode === 'low' && (
                    <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reduced quality with optimized settings for smooth 60fps. Adaptive rendering adjusts based on your device performance.
                </p>
              </div>
            </button>
          </div>

          <div className="p-3 border-t border-border bg-muted/50">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Performance mode automatically adjusts resolution, anti-aliasing, and post-processing effects to maintain optimal frame rates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
