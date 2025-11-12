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
    <div className="fixed bottom-4 right-4 z-50 w-[min(90vw,18rem)] animate-in slide-in-from-bottom-5">
      <div className="rounded-xl border border-white/20 bg-black/70 px-3 py-3 shadow-lg backdrop-blur">
        <div className="flex items-start gap-3 text-white">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold">Smooth things out?</p>
            <p className="text-xs text-white/70">
              Trim visuals for better battery and frame rate. You can switch back anytime.
            </p>
          </div>
          <button
            onClick={handleIgnore}
            className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Close notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            onClick={handleAccept}
            className="h-8 flex-1 rounded-full bg-white text-black hover:bg-white/90"
          >
            Enable
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleIgnore}
            className="h-8 flex-1 rounded-full border-white/40 bg-transparent text-white hover:bg-white/10"
          >
            Later
          </Button>
        </div>
      </div>
    </div>
  );
}
