'use client';
import { useState, useEffect } from 'react';
import Dither from "@/components/Dither";
import GlassSurface from "@/components/GlassSurface";
import ClickSpark from "@/components/ClickSpark";
import TextPressure from "@/components/TextPressure";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PerformanceProvider } from "@/lib/performance-context";
import { PerformanceNotification } from "@/components/PerformanceNotification";
import { PerformanceToggle } from "@/components/PerformanceToggle";
import { detectDeviceCapabilities, needsPerformanceOptimizations } from "@/lib/device-detection";

function HomeContent() {
  const [showNotification, setShowNotification] = useState(false);
  const [deviceNeedsOptimization, setDeviceNeedsOptimization] = useState(false);
  const [performanceEnabled, setPerformanceEnabled] = useState(false);
  const [dprRange, setDprRange] = useState<[number, number]>([1, 1.5]);

  useEffect(() => {
    // Detect device on mount
    const capabilities = detectDeviceCapabilities();
    const needsOpt = needsPerformanceOptimizations(capabilities);
    
    // Check if user previously made a choice
    const userChoice = localStorage.getItem('performanceOptimizationsChoice');
    
    if (needsOpt && !userChoice) {
      // Show notification if device needs optimization and user hasn't chosen yet
      setShowNotification(true);
    } else if (userChoice === 'enabled') {
      setPerformanceEnabled(true);
    }

    // Set DPR based on device
    let newDprRange: [number, number] = [1, 1.5];
    if (capabilities.isLowEnd) {
      newDprRange = [1, 1.25];
    } else if (capabilities.isMidTier) {
      newDprRange = [1, 1.5];
    } else {
      newDprRange = [1, 2];
    }

    // Batch state updates
    setDeviceNeedsOptimization(needsOpt);
    setDprRange(newDprRange);
  }, []);

  const handleIgnoreOptimizations = () => {
    setShowNotification(false);
    setPerformanceEnabled(false);
    localStorage.setItem('performanceOptimizationsChoice', 'ignored');
  };

  const handleAcceptOptimizations = () => {
    setShowNotification(false);
    setPerformanceEnabled(true);
    localStorage.setItem('performanceOptimizationsChoice', 'enabled');
  };

  const handlePerformanceModeChange = (mode: 'high' | 'low') => {
    const isLowMode = mode === 'low';
    setPerformanceEnabled(isLowMode);
    localStorage.setItem('performanceOptimizationsChoice', isLowMode ? 'enabled' : 'ignored');
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Dither background layer with performance optimizations */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
          enablePostProcessing={!performanceEnabled || !deviceNeedsOptimization}
          enableAdaptivePerformance={performanceEnabled}
          dprRange={dprRange}
          enableAntialiasing={!performanceEnabled}
        />
      </div>

      {/* ClickSpark overlay layer */}
      <ClickSpark
        sparkColor='#ffffff'
        sparkSize={10}
        sparkRadius={20}
        sparkCount={8}
        duration={500}
        easing="ease-out"
      >
        {/* Glass Navbar */}
        <div className="fixed top-4 sm:top-6 md:top-8 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6 md:px-8 z-50">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={28}
            className="px-4 py-3 sm:px-6 sm:py-4"
          >
            <div className="w-full flex flex-wrap items-center justify-between gap-3 text-white">
              <span className="text-base font-medium sm:text-lg">freddiephilpot.dev</span>
              <nav className="flex flex-wrap items-center justify-center gap-4 text-xs sm:gap-6 sm:text-sm md:gap-8 md:justify-end whitespace-nowrap">
                <a href="#home" className="hover:opacity-70 transition-opacity">
                  Home
                </a>
                <a href="#work" className="hover:opacity-70 transition-opacity">
                  Work
                </a>
                <a href="#homelab" className="hover:opacity-70 transition-opacity">
                  Homelab
                </a>
                <a href="#contact" className="hover:opacity-70 transition-opacity">
                  Contact
                </a>
              </nav>
            </div>
          </GlassSurface>
        </div>

        {/* Center Content - Hello Text with TextPressure */}
        <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none gap-5 px-4">
          <div className="relative flex h-[140px] w-[min(80vw,320px)] items-center justify-center sm:h-[180px] sm:w-[360px] md:h-[200px] md:w-[420px]">
            <TextPressure
              text="Hello"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={false}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={28}
            />
          </div>
          <p className="pointer-events-auto text-white text-base leading-relaxed text-center font-semibold tracking-wide font-sans sm:text-lg max-w-[min(90vw,520px)]">
            I&apos;m Freddie a 15 year old student who is studying Cyber Security
          </p>
        </div>

        {/* Download CV Button */}
        <div className="fixed bottom-6 left-1/2 z-10 w-[min(88vw,320px)] -translate-x-1/2 sm:bottom-8">
          <div className="flex items-center gap-2">
            <Button
              size="lg"
              className="flex-[3] rounded-full justify-center text-sm sm:text-base"
              asChild
            >
              <a href="/cv.pdf" target="_blank" rel="noreferrer">
                View PDF
              </a>
            </Button>
            <Button
              size="lg"
              className="flex-[1] aspect-square rounded-full p-0 transition-transform hover:scale-105"
              asChild
            >
              <a href="/cv.pdf" download="cv.pdf" aria-label="Download CV">
                <Download className="h-5 w-5" />
                <span className="sr-only">Download CV</span>
              </a>
            </Button>
          </div>
        </div>
      </ClickSpark>

      {/* Performance Toggle Button - Bottom Right */}
      <div className="fixed bottom-24 right-4 z-[100] sm:bottom-8 sm:right-8">
        <PerformanceToggle 
          currentMode={performanceEnabled ? 'low' : 'high'}
          onModeChange={handlePerformanceModeChange}
        />
      </div>

      {/* Performance Notification */}
      {showNotification && deviceNeedsOptimization && (
        <PerformanceNotification
          onIgnore={handleIgnoreOptimizations}
          onAccept={handleAcceptOptimizations}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <PerformanceProvider>
      <HomeContent />
    </PerformanceProvider>
  );
}
