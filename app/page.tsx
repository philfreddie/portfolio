'use client';
import Dither from "@/components/Dither";
import GlassSurface from "@/components/GlassSurface";
import ClickSpark from "@/components/ClickSpark";
import TextPressure from "@/components/TextPressure";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Home() {
  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Dither background layer */}
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
            I'm Freddie a 15 year old student who is studying Cyber Security
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
    </div>
  );
}
