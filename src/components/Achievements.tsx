"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Trophy } from "lucide-react";
import { useTheme } from "./ThemeProvider";

type HackathonType = {
  id: string;
  year: string;
  name: string;
  badge: string;
  image: string;
};

export function Achievements() {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [activeHackathonIndex, setActiveHackathonIndex] = useState(0);

  const hackathons: HackathonType[] = [
    { id: "bfg2026", year: "2026", name: "Build for Good Hackathon", badge: "2nd Prize", image: "/hackathons/build_for_good_2026.jpg" },
    { id: "sih2024", year: "2024", name: "Smart India Hackathon", badge: "WINNER", image: "/hackathons/sih_2024.jpg" },
    { id: "jungli2024", year: "2024", name: "Jungli Hackathon", badge: "Runner-up", image: "/hackathons/jungli_2024.jpg" },
    { id: "shankara2024", year: "2024", name: "Shankara Hackathon", badge: "1st Runner-up", image: "/hackathons/shankara_2024.jpg" },
    { id: "sih2023", year: "2023", name: "Smart India Hackathon", badge: "WINNER", image: "/hackathons/sih_2023.jpg" },
    { id: "mnit2023", year: "2023", name: "MNIT Hackathon", badge: "WINNER", image: "/hackathons/mnit_2023.jpg" },
    { id: "istart2023", year: "2023", name: "iStart Ideathon", badge: "WINNER", image: "/hackathons/istart_2023.jpg" },
  ];

  // Synchronize with global AudioManager state
  useEffect(() => {
    const handlePlayState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying: boolean }>;
      if (customEvent.detail) {
        setIsPlaying(customEvent.detail.isPlaying);
      }
    };

    const handleVolumeState = (e: Event) => {
      const customEvent = e as CustomEvent<{ volume: number }>;
      if (customEvent.detail) {
        setVolume(customEvent.detail.volume);
      }
    };

    window.addEventListener("audio-play-state", handlePlayState);
    window.addEventListener("audio-volume-change", handleVolumeState);

    return () => {
      window.removeEventListener("audio-play-state", handlePlayState);
      window.removeEventListener("audio-volume-change", handleVolumeState);
    };
  }, []);

  const toggleSound = () => {
    window.dispatchEvent(new CustomEvent("toggle-audio-global"));
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    window.dispatchEvent(new CustomEvent("set-volume-global", { detail: { volume: newVal } }));
  };

  const nextSlide = () => {
    setActiveHackathonIndex((prev) => (prev + 1) % hackathons.length);
  };

  const prevSlide = () => {
    setActiveHackathonIndex((prev) => (prev - 1 + hackathons.length) % hackathons.length);
  };

  return (
    <section 
      id="achievements" 
      className="w-full py-24 bg-background text-foreground relative overflow-hidden font-mono border-y border-border select-none animate-fade-in"
      style={{
        backgroundImage: "var(--bg-dots)",
        backgroundSize: "24px 24px"
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Antonio:wght@700&family=Share+Tech+Mono&display=swap');
        .hh-title {
          font-family: 'Antonio', 'Oswald', sans-serif;
          letter-spacing: -0.02em;
        }
        .hh-mono {
          font-family: 'Share Tech Mono', monospace;
        }
      `}</style>

      <div className="absolute top-20 left-10 opacity-20 pointer-events-none hidden md:block">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0 20 Q 15 5, 30 20 T 60 20" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 pointer-events-none hidden md:block">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0 20 Q 15 35, 30 20 T 60 20" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Sound Bar Interface */}
        <div className="flex items-center justify-between border border-border bg-white/10 dark:bg-white/[0.03] backdrop-blur-sm px-4 py-2.5 rounded-xl mb-12 shadow-sm">
          <span className="hh-mono text-xs md:text-sm text-[#09692a] dark:text-[#3fb950] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#108548] dark:bg-[#3fb950] animate-ping" />
            HACKATHON ACHIEVEMENTS
          </span>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider hh-mono opacity-60 hidden sm:inline">Volume</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 md:w-24 h-1 bg-black/10 dark:bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#d12b6f] dark:accent-[#3fb950]"
                style={{
                  background: `linear-gradient(to right, ${theme === 'dark' ? '#3fb950' : '#d12b6f'} ${volume * 100}%, ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} ${volume * 100}%)`
                }}
              />
            </div>
            
            <button 
              onClick={toggleSound}
              className="flex items-center gap-2 px-3 py-1 border border-black/20 dark:border-white/20 hover:border-black/50 dark:hover:border-white/50 bg-[#fbfbf8] dark:bg-[#161c18] rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 flex-row cursor-pointer text-foreground shadow-sm"
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#d12b6f] dark:text-[#3fb950] animate-pulse" />
                  <span className="hh-mono text-[10px]">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 opacity-60" />
                  <span className="hh-mono text-[10px] opacity-60">Mute</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center mb-16">
          <h2 className="hh-title text-6xl md:text-8xl font-black text-foreground uppercase tracking-tighter mb-4 leading-none">
            HACKATHON VICTORIES
          </h2>
          <p className="hh-mono text-[#09692a] dark:text-[#3fb950] text-xs md:text-sm font-bold uppercase tracking-wide max-w-2xl mx-auto">
            A curated log of first-place championships and podium finishes at regional and national engineering hackathons.
          </p>
        </div>

        {/* Side-by-Side Slider and Registry Log */}
        <div className="flex flex-col lg:flex-row gap-12 items-stretch mt-12">
          {/* Left Column: Terminal Photo Monitor */}
          <div className="flex-1 border-[3px] border-border bg-[#0d1117] rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden group min-h-[350px] md:min-h-[450px]">
            {/* Monitor Header Bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="hh-mono text-[9px] font-bold text-[#8b949e] tracking-widest">victory-monitor.sh</span>
            </div>

            {/* Photo Slideshow Area */}
            <div className="flex-1 rounded-2xl border border-white/5 bg-black overflow-hidden relative flex items-center justify-center min-h-[220px]">
              <AnimatePresence mode="wait">
                {hackathons[activeHackathonIndex].image ? (
                  <motion.img
                    key={activeHackathonIndex}
                    src={hackathons[activeHackathonIndex].image}
                    alt={hackathons[activeHackathonIndex].name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  /* Placeholder badge for items without photos */
                  <motion.div
                    key={activeHackathonIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 text-center p-6 text-white"
                  >
                    <Trophy className="w-16 h-16 text-[#3fb950] animate-bounce" />
                    <span className="hh-mono text-xs uppercase tracking-widest font-bold">Proof registry verified</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 hh-mono text-[10px] text-[#8b949e]">
              <span>SLIDE {activeHackathonIndex + 1} OF {hackathons.length}</span>
              <div className="flex gap-3">
                <button 
                  onClick={prevSlide}
                  className="px-2.5 py-1 border border-white/10 hover:border-white/30 rounded text-white cursor-pointer transition-colors"
                >
                  PREV
                </button>
                <button 
                  onClick={nextSlide}
                  className="px-2.5 py-1 border border-white/10 hover:border-white/30 rounded text-white cursor-pointer transition-colors"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Victory Log Registry */}
          <div className="w-full lg:w-[45%] border-[3px] border-border bg-bg-secondary rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute inset-2 border border-dashed border-foreground/10 rounded-2xl pointer-events-none" />

            <div className="z-10 flex flex-col gap-2.5 h-full justify-between py-2">
              <div className="flex flex-col">
                <span className="hh-mono text-[10px] font-black uppercase text-foreground/50 tracking-wider mb-3">
                  ▲ SYSTEM VICTORIES LOG
                </span>

                {/* List Container */}
                <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {hackathons.map((item, index) => {
                    const isActive = activeHackathonIndex === index;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveHackathonIndex(index)}
                        className={`w-full text-left p-3 border rounded-xl flex items-center justify-between transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? "bg-foreground text-background border-foreground shadow-lg scale-[1.02]" 
                            : "bg-background/40 hover:bg-background/70 border-border text-foreground hover:scale-[1.01]"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className={`hh-mono text-[9px] font-bold ${isActive ? 'text-background/80' : 'text-[#09692a] dark:text-[#3fb950]'}`}>
                            {item.year}
                          </span>
                          <span className="text-xs font-black uppercase tracking-tight leading-snug">
                            {item.name}
                          </span>
                        </div>
                        <span className={`hh-mono text-[9px] font-black border px-1.5 py-0.5 rounded uppercase ${
                          isActive 
                            ? "border-background/30 text-background" 
                            : item.badge === "WINNER" 
                              ? "border-[#108548]/30 text-[#108548] dark:text-[#3fb950] bg-[#3fb950]/5" 
                              : "border-[#d12b6f]/30 text-[#d12b6f] dark:text-[#58a6ff] bg-[#58a6ff]/5"
                        }`}>
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary Metadata */}
              <div className="border-t border-border pt-4 mt-4 flex items-center justify-between text-[10px] hh-mono text-foreground/60">
                <span>TOTAL: 7 CHAMPIONSHIPS</span>
                <span className="text-[#09692a] dark:text-[#3fb950] font-bold">● VERIFIED ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
