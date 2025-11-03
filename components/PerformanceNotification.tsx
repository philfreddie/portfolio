'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface PerformanceNotificationProps {
  onIgnore: () => void;
  onAccept: () => void;
}

export function PerformanceNotification({ onIgnore, onAccept }: PerformanceNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const handleIgnore = () => {
    setIsVisible(false);
    onIgnore();
  };

  const handleAccept = () => {
    setIsVisible(false);
    onAccept();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Performance Optimizations Available
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Your device may benefit from performance optimizations. This will reduce visual quality slightly to improve frame rates.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Enable Optimizations
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleIgnore}
              >
                Keep High Quality
              </Button>
            </div>
          </div>
          <button
            onClick={handleIgnore}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
