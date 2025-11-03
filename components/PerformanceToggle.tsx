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
        <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in">
          <div className="p-3 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-sm font-semibold text-gray-900">Performance Mode</h3>
            <p className="text-xs text-gray-600 mt-0.5">Choose your preferred rendering quality</p>
          </div>

          <div className="p-2">
            {/* High Performance Option */}
            <button
              onClick={() => handleModeSelect('high')}
              className={`w-full flex items-start gap-3 p-3 rounded-md transition-all ${
                currentMode === 'high'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                currentMode === 'high' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Zap className={`h-4 w-4 ${currentMode === 'high' ? 'text-blue-600' : 'text-gray-600'}`} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    currentMode === 'high' ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    High Quality
                  </span>
                  {currentMode === 'high' && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Maximum visual quality with full post-processing effects and higher resolution. Best for powerful devices.
                </p>
              </div>
            </button>

            {/* Low Performance Option */}
            <button
              onClick={() => handleModeSelect('low')}
              className={`w-full flex items-start gap-3 p-3 rounded-md transition-all mt-2 ${
                currentMode === 'low'
                  ? 'bg-green-50 border border-green-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                currentMode === 'low' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Shield className={`h-4 w-4 ${currentMode === 'low' ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    currentMode === 'low' ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    Optimized Performance
                  </span>
                  {currentMode === 'low' && (
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Reduced quality with optimized settings for smooth 60fps. Adaptive rendering adjusts based on your device performance.
                </p>
              </div>
            </button>
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50/50">
            <p className="text-xs text-gray-500 leading-relaxed">
              Performance mode automatically adjusts resolution, anti-aliasing, and post-processing effects to maintain optimal frame rates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
