"use client";

import { useState, useEffect } from "react";
import { Award, Zap, GitBranch } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ROWS = 7;
const COLS = 45;

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function GithubSnake() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate a stable contribution intensity matrix based on grid position
  const getContributionColor = (r: number, c: number) => {
    const intensity = (r * 3 + c * 7) % 5;
    
    if (theme === "dark") {
      switch (intensity) {
        case 0: return "bg-[#161b22] hover:bg-[#21262d]";
        case 1: return "bg-[#0e4429] hover:bg-[#006d32] hover:shadow-[0_0_8px_rgba(14,68,41,0.6)]";
        case 2: return "bg-[#006d32] hover:bg-[#26a641] hover:shadow-[0_0_8px_rgba(0,109,50,0.6)]";
        case 3: return "bg-[#26a641] hover:bg-[#39d353] hover:shadow-[0_0_8px_rgba(38,166,65,0.6)]";
        case 4: return "bg-[#39d353] hover:shadow-[0_0_12px_rgba(57,211,83,0.8)]";
        default: return "bg-[#161b22]";
      }
    } else {
      switch (intensity) {
        case 0: return "bg-[#ebedf0] hover:bg-[#e1e4e8]";
        case 1: return "bg-[#c6e48b] hover:bg-[#7bc96f] hover:shadow-[0_0_8px_rgba(198,228,139,0.6)]";
        case 2: return "bg-[#7bc96f] hover:bg-[#239a3b] hover:shadow-[0_0_8px_rgba(123,201,111,0.6)]";
        case 3: return "bg-[#239a3b] hover:bg-[#196127] hover:shadow-[0_0_8px_rgba(35,154,59,0.6)]";
        case 4: return "bg-[#196127] hover:shadow-[0_0_12px_rgba(25,97,39,0.8)]";
        default: return "bg-[#ebedf0]";
      }
    }
  };

  if (!mounted) return null;

  return (
    <section 
      id="contributions" 
      className="w-full py-20 bg-background border-t border-border flex flex-col items-center relative overflow-hidden font-mono"
      style={{
        backgroundImage: "var(--bg-dots)",
        backgroundSize: "24px 24px"
      }}
    >
      <div className="max-w-4xl w-full px-6 flex flex-col items-center">
        
        {/* Header Title */}
        <div className="text-center mb-10 flex flex-col items-center">
          <h2 className="hh-title text-3xl md:text-5xl font-black uppercase tracking-tighter flex items-center justify-center gap-3 text-foreground">
            <GithubIcon className="w-8 h-8 text-foreground" /> 
            GITHUB ACTIVITY
          </h2>
          <span className="hh-mono text-[10px] md:text-xs font-bold tracking-widest text-[#09692a] dark:text-[#3fb950] uppercase mt-2">
            CONTRIBUTIONS & PIPELINE RECORD
          </span>
        </div>

        {/* Minimal Dashboard Container */}
        <div className="w-full border-2 border-border bg-bg-secondary/40 backdrop-blur-sm rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-6">
          <div className="absolute inset-1.5 border border-dashed border-foreground/5 rounded-2xl pointer-events-none" />

          {/* Top Row Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 z-10">
            <div className="border border-border p-4 bg-background/40 rounded-2xl flex items-center gap-3 shadow-sm hover:border-cyan-accent transition-colors duration-300">
              <Award className="w-5 h-5 text-cyan-accent dark:text-[#3fb950]" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-text-muted">Total Commits</span>
                <span className="text-base font-black text-foreground">1,531 Commits</span>
              </div>
            </div>

            <div className="border border-border p-4 bg-background/40 rounded-2xl flex items-center gap-3 shadow-sm hover:border-cyan-accent transition-colors duration-300">
              <Zap className="w-5 h-5 text-cyan-accent dark:text-[#3fb950]" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-text-muted">Active Streak</span>
                <span className="text-base font-black text-foreground">42 Days</span>
              </div>
            </div>

            <div className="border border-border p-4 bg-background/40 rounded-2xl flex items-center gap-3 shadow-sm hover:border-cyan-accent transition-colors duration-300">
              <GitBranch className="w-5 h-5 text-cyan-accent dark:text-[#3fb950]" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-text-muted">Git Identity</span>
                <span className="text-base font-black text-foreground">@harshit075</span>
              </div>
            </div>
          </div>

          {/* Contributions Matrix Grid */}
          <div className="overflow-x-auto w-full no-scrollbar border border-border bg-background/30 p-5 rounded-2xl shadow-inner z-10">
            <div
              className="grid gap-[4px] md:gap-[5px] min-w-[580px]"
              style={{
                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: ROWS }).map((_, r) =>
                Array.from({ length: COLS }).map((_, c) => {
                  const bgClass = getContributionColor(r, c);
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-[10px] h-[10px] md:w-[11px] md:h-[11px] rounded-[2px] transition-all duration-300 transform hover:scale-125 z-10 cursor-pointer ${bgClass}`}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Footer Info Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-text-muted hh-mono px-1 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#108548] dark:bg-[#3fb950] animate-pulse" />
              <span>CI/CD RUNNER CONNECTED</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#ebedf0] dark:bg-[#161b22]" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#c6e48b] dark:bg-[#0e4429]" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#7bc96f] dark:bg-[#006d32]" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#239a3b] dark:bg-[#26a641]" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#196127] dark:bg-[#39d353]" />
              <span>More</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
