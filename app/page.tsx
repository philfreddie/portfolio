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
      <div className="fixed inset-0 w-full h-full">
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
        <div className="fixed top-8 left-1/2 -translate-x-1/2 w-3/4 z-10">
          <GlassSurface
            width="100%"
            height={64}
            borderRadius={32}
            className="px-8"
          >
            <div className="w-full flex items-center justify-between text-white">
              <span className="text-lg font-medium">freddiephilpot.dev</span>
              <div className="flex items-center gap-8">
                <nav className="flex items-center gap-8">
                  <a href="#home" className="text-sm hover:opacity-70 transition-opacity">
                    Home
                  </a>
                  <a href="#work" className="text-sm hover:opacity-70 transition-opacity">
                    Work
                  </a>
                  <a href="#homelab" className="text-sm hover:opacity-70 transition-opacity">
                    Homelab
                  </a>
                  <a href="#contact" className="text-sm hover:opacity-70 transition-opacity">
                    Contact
                  </a>
                </nav>
                <PerformanceToggle 
                  currentMode={performanceEnabled ? 'low' : 'high'}
                  onModeChange={handlePerformanceModeChange}
                />
              </div>
            </div>
          </GlassSurface>
        </div>

        {/* Center Content - Hello Text with TextPressure */}
        <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none gap-4">
          <div style={{ position: 'relative', height: '200px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              minFontSize={36}
            />
          </div>
          <p className="text-white text-lg text-center px-4 font-semibold tracking-wide font-sans">
            I&apos;m Freddie a 15 year old student who is studying Cyber Security
          </p>
        </div>

        {/* Download CV Button */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
          <Button size="lg" className="rounded-full" asChild>
            <a href="/cv.pdf" download="cv.pdf">
              <Download className="mr-2 h-4 w-4" />
              Download CV
            </a>
          </Button>
        </div>
      </ClickSpark>

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
