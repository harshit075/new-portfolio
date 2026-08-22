"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

type Track = {
  name: string;
  artist: string;
  url: string;
};

const tracks: Record<string, Track> = {
  hero: { name: "Synthwave Horizon", artist: "Retro Chill", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  projects: { name: "Cyberpunk Pipeline", artist: "Matrix Beat", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  about: { name: "Acoustic Reflection", artist: "Lofi Focus", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  achievements: { name: "Retro Rankings Beat", artist: "HGoa Synth", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  skills: { name: "Digital Workflow", artist: "Pipeline Tech", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
};

export function AudioManager() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("hero");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showControls, setShowControls] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize main audio element
  useEffect(() => {
    const defaultTrack = tracks.hero;
    const audio = new Audio(defaultTrack.url);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const handleToggleEvent = () => {
      toggleAudio();
    };

    const handleVolumeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ volume: number }>;
      if (customEvent.detail && typeof customEvent.detail.volume === "number") {
        setVolume(customEvent.detail.volume);
      }
    };

    window.addEventListener("toggle-audio-global", handleToggleEvent);
    window.addEventListener("set-volume-global", handleVolumeEvent);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      window.removeEventListener("toggle-audio-global", handleToggleEvent);
      window.removeEventListener("set-volume-global", handleVolumeEvent);
    };
  }, []);

  // Sync state to local audio and broadcast to other listeners
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    window.dispatchEvent(new CustomEvent("audio-volume-change", { detail: { volume } }));
  }, [volume]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("audio-play-state", { detail: { isPlaying } }));
  }, [isPlaying]);

  // Section Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = ["hero", "projects", "about", "achievements", "skills"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Track switching via Safe Single-Player Cross-Fade
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !tracks[activeSection]) return;

    const newTrack = tracks[activeSection];
    const newUrl = newTrack.url;
    const oldUrl = audio.src;

    // Safe comparison of paths to see if the track is already loaded
    const getPath = (urlStr: string) => {
      try {
        const parsed = new URL(urlStr, window.location.origin);
        return parsed.pathname + parsed.search;
      } catch {
        return urlStr;
      }
    };

    if (getPath(oldUrl) === getPath(newUrl)) {
      return;
    }

    // Cancel any active transitions
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    if (!isPlaying) {
      // Just swap track source silently if paused
      audio.src = newUrl;
      audio.load();
      audio.volume = volume;
      return;
    }

    // Fade out old track, swap src, load new track, and fade back in
    const targetVolume = volume;
    let fadeOutVolume = audio.volume;

    fadeIntervalRef.current = setInterval(() => {
      if (fadeOutVolume > 0.05) {
        fadeOutVolume = Math.max(0, fadeOutVolume - 0.05);
        audio.volume = fadeOutVolume;
      } else {
        clearInterval(fadeIntervalRef.current!);
        
        audio.src = newUrl;
        audio.load();
        audio.volume = 0;
        
        audio.play()
          .then(() => {
            let fadeInVolume = 0;
            fadeIntervalRef.current = setInterval(() => {
              if (fadeInVolume < targetVolume - 0.05) {
                fadeInVolume = Math.min(targetVolume, fadeInVolume + 0.05);
                audio.volume = fadeInVolume;
              } else {
                audio.volume = targetVolume;
                clearInterval(fadeIntervalRef.current!);
              }
            }, 40);
          })
          .catch((err) => {
            console.log("Audio switch play blocked: ", err);
            audio.volume = targetVolume;
          });
      }
    }, 40);

  }, [activeSection]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play blocked by browser sandbox: ", err));
    }
  };

  const currentTrack = tracks[activeSection] || tracks.hero;

  return (
    <div className="fixed top-6 right-20 z-50 font-mono">
      <div className="relative">
        {/* Floating Mini visualizer button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="flex items-center gap-2 p-2.5 border border-border bg-background hover:bg-foreground hover:text-background transition-colors cursor-pointer rounded-none shadow-md group"
          title={`Active Track: ${currentTrack.name}`}
        >
          {isPlaying ? (
            /* Bouncing Equalizer Bars */
            <div className="w-5 h-5 flex items-end gap-[2px] overflow-hidden pr-[1px]">
              <div className="w-[3px] bg-cyan-accent dark:bg-[#3fb950] animate-[eq-bar_0.8s_ease-in-out_infinite_alternate]" style={{ height: "40%" }} />
              <div className="w-[3px] bg-cyan-accent dark:bg-[#3fb950] animate-[eq-bar_1.1s_ease-in-out_infinite_alternate_0.2s]" style={{ height: "70%" }} />
              <div className="w-[3px] bg-cyan-accent dark:bg-[#3fb950] animate-[eq-bar_0.9s_ease-in-out_infinite_alternate_0.4s]" style={{ height: "30%" }} />
              <div className="w-[3px] bg-cyan-accent dark:bg-[#3fb950] animate-[eq-bar_1.3s_ease-in-out_infinite_alternate_0.1s]" style={{ height: "90%" }} />
            </div>
          ) : (
            /* Flat silent bars */
            <div className="w-5 h-5 flex items-end gap-[2px] opacity-60">
              <div className="w-[3px] h-[3px] bg-foreground/60" />
              <div className="w-[3px] h-[3px] bg-foreground/60" />
              <div className="w-[3px] h-[3px] bg-foreground/60" />
              <div className="w-[3px] h-[3px] bg-foreground/60" />
            </div>
          )}
          <Music className="w-4 h-4 hidden sm:block opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Global Sound Control Panel Dropdown */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-64 p-4 border border-border bg-background shadow-2xl flex flex-col gap-3.5"
            >
              {/* Header */}
              <div className="border-b border-border pb-2 flex items-center justify-between text-[10px] uppercase font-bold text-text-muted">
                <span>Sound Console</span>
                <span className="text-cyan-accent dark:text-[#3fb950] animate-pulse">● Active</span>
              </div>

              {/* Track Metadata */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-extrabold text-text-muted">Current track</span>
                <span className="text-xs font-black uppercase text-foreground leading-snug truncate">
                  {currentTrack.name}
                </span>
                <span className="text-[9px] font-bold text-[#108548] dark:text-[#3fb950] uppercase tracking-wider">
                  Section: {activeSection}
                </span>
              </div>

              {/* Controls bar */}
              <div className="flex items-center gap-3 mt-1">
                <button
                  onClick={toggleAudio}
                  className="p-2 border border-border hover:bg-foreground hover:text-background rounded-lg transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-[#d12b6f] dark:text-[#3fb950]" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[8px] uppercase font-bold text-text-muted">Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black/10 dark:bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#d12b6f] dark:accent-[#3fb950]"
                    style={{
                      background: `linear-gradient(to right, ${theme === 'dark' ? '#3fb950' : '#d12b6f'} ${volume * 100}%, ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} ${volume * 100}%)`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Embedded CSS styles for equalizer bars keyframe animations */}
      <style jsx global>{`
        @keyframes eq-bar {
          0% { height: 15%; }
          100% { height: 95%; }
        }
      `}</style>
    </div>
  );
}
