"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, Award, Zap, RefreshCw } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ROWS = 7;
const COLS = 45;
const SNAKE_LENGTH = 5;

type Point = { r: number; c: number };

export function GithubSnake() {
  const { theme } = useTheme();
  
  // State for rendering
  const [snake, setSnake] = useState<Point[]>([
    { r: 3, c: 5 },
    { r: 3, c: 4 },
    { r: 3, c: 3 },
    { r: 3, c: 2 },
    { r: 3, c: 1 },
  ]);
  const [foods, setFoods] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [totalCommits, setTotalCommits] = useState(1531);
  const [activeStreak, setActiveStreak] = useState(42);
  const [logs, setLogs] = useState<string[]>([
    "Initializing CI/CD Pipeline Agent...",
    "Connecting to Kubernetes cluster via kubeconfig...",
    "Pipeline Agent ready. Listening for incoming webhook triggers..."
  ]);

  // Refs for stable game loop execution
  const snakeRef = useRef<Point[]>([
    { r: 3, c: 5 },
    { r: 3, c: 4 },
    { r: 3, c: 3 },
    { r: 3, c: 2 },
    { r: 3, c: 1 },
  ]);
  const foodsRef = useRef<Set<string>>(new Set());
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll terminal logs to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Stable Game Loop
  useEffect(() => {
    if (!mounted) return;

    // Initialize foods in ref and state once on mount
    const initialFoods = new Set<string>();
    while (initialFoods.size < 35) {
      initialFoods.add(
        `${Math.floor(Math.random() * ROWS)},${Math.floor(Math.random() * COLS)}`
      );
    }
    foodsRef.current = initialFoods;
    setFoods(new Set(initialFoods));

    const interval = setInterval(() => {
      const currentSnake = [...snakeRef.current];
      const currentFoods = new Set(foodsRef.current);
      const head = currentSnake[0];
      let target: Point | null = null;
      let minDist = Infinity;

      // Find closest food
      currentFoods.forEach((f) => {
        const [fr, fc] = f.split(",").map(Number);
        const dist = Math.abs(fr - head.r) + Math.abs(fc - head.c);
        if (dist < minDist) {
          minDist = dist;
          target = { r: fr, c: fc };
        }
      });

      // Filter moves to prevent 180-degree turns
      const moves = [
        { r: 0, c: 1 },
        { r: 0, c: -1 },
        { r: 1, c: 0 },
        { r: -1, c: 0 },
      ].filter(
        (m) =>
          !(
            currentSnake.length > 1 &&
            head.r + m.r === currentSnake[1].r &&
            head.c + m.c === currentSnake[1].c
          )
      );

      if (target) {
        moves.sort((a, b) => {
          const distA = Math.abs(head.r + a.r - target!.r) + Math.abs(head.c + a.c - target!.c);
          const distB = Math.abs(head.r + b.r - target!.r) + Math.abs(head.c + b.c - target!.c);
          return distA - distB;
        });
      }

      let bestMove = moves[0];
      for (const m of moves) {
        const nr = head.r + m.r;
        const nc = head.c + m.c;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          bestMove = m;
          break;
        }
      }

      const newHead = { r: head.r + bestMove.r, c: head.c + bestMove.c };
      
      // Wrap boundaries
      if (newHead.r < 0) newHead.r = ROWS - 1;
      if (newHead.r >= ROWS) newHead.r = 0;
      if (newHead.c < 0) newHead.c = COLS - 1;
      if (newHead.c >= COLS) newHead.c = 0;

      const newSnake = [newHead, ...currentSnake];
      const foodKey = `${newHead.r},${newHead.c}`;

      if (currentFoods.has(foodKey)) {
        currentFoods.delete(foodKey);
        
        // Spawn new food
        let spawned = false;
        while (!spawned) {
          const nr = Math.floor(Math.random() * ROWS);
          const nc = Math.floor(Math.random() * COLS);
          const nk = `${nr},${nc}`;
          if (!currentFoods.has(nk)) {
            currentFoods.add(nk);
            spawned = true;
          }
        }

        // Trigger updates
        setTotalCommits((prev) => prev + 1);
        if (Math.random() > 0.8) {
          setActiveStreak((prev) => prev + 1);
        }

        const steps = ["BUILDING CONTAINER", "RUNNING UNIT TESTS", "PUSHING REGISTRY", "DEPLOYING PODS"];
        const selectedStep = steps[Math.floor(Math.random() * steps.length)];
        const commitHash = Math.random().toString(36).substring(2, 8);
        
        setLogs((prevLogs) => [
          ...prevLogs,
          `[${new Date().toLocaleTimeString()}] Pipeline #${Math.floor(Math.random() * 900) + 100} triggered on main`,
          `[${new Date().toLocaleTimeString()}] 🚀 commit:${commitHash} -> ${selectedStep}: OK`,
          `[${new Date().toLocaleTimeString()}] Deployment commit:${commitHash} verified successfully.`
        ]);

      } else {
        newSnake.pop();
      }

      if (newSnake.length > SNAKE_LENGTH) {
        newSnake.pop();
      }

      // Update refs
      snakeRef.current = newSnake;
      foodsRef.current = currentFoods;

      // Update rendering state
      setSnake(newSnake);
      setFoods(currentFoods);
    }, 120);

    return () => clearInterval(interval);
  }, [mounted]);

  // Contribution grid helper colors
  const getContributionColor = (r: number, c: number) => {
    const intensity = (r * 3 + c * 7) % 5;
    
    if (theme === "dark") {
      switch (intensity) {
        case 0: return "bg-[#161b22]";
        case 1: return "bg-[#0e4429]";
        case 2: return "bg-[#006d32]";
        case 3: return "bg-[#26a641]";
        case 4: return "bg-[#39d353]";
        default: return "bg-[#161b22]";
      }
    } else {
      switch (intensity) {
        case 0: return "bg-[#ebedf0]";
        case 1: return "bg-[#c6e48b]";
        case 2: return "bg-[#7bc96f]";
        case 3: return "bg-[#239a3b]";
        case 4: return "bg-[#196127]";
        default: return "bg-[#ebedf0]";
      }
    }
  };

  if (!mounted) return null;

  return (
    <section 
      id="contributions" 
      className="w-full py-24 bg-background border-t border-border flex flex-col items-center relative overflow-hidden font-mono"
      style={{
        backgroundImage: "var(--bg-dots)",
        backgroundSize: "24px 24px"
      }}
    >
      <div className="max-w-6xl w-full px-6 flex flex-col items-center">
        
        {/* Header Title */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="hh-title text-4xl md:text-6xl font-black uppercase tracking-tighter flex items-center justify-center gap-3 text-foreground">
            <RefreshCw className="w-8 h-8 text-cyan-accent dark:text-[#3fb950] animate-spin-slow" /> 
            CONTRIBUTIONS
          </h2>
          <span className="hh-mono text-xs md:text-sm font-bold tracking-widest text-[#09692a] dark:text-[#3fb950] uppercase mt-2">
            CI/CD PIPELINE METRICS & ACTIVITY PIPES
          </span>
        </div>

        {/* Side-by-Side Console and Grid */}
        <div className="w-full flex flex-col lg:flex-row gap-10 items-stretch justify-center mt-6">
          
          {/* Left Block: Contribution Matrix Grid */}
          <div className="flex-1 border-[3px] border-border bg-bg-secondary rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute inset-2 border border-dashed border-foreground/10 rounded-2xl pointer-events-none" />

            <div className="z-10 flex flex-col h-full justify-between gap-6 py-1">
              
              {/* Top Stats Rows */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border p-3.5 bg-background/50 rounded-xl flex items-center gap-3 shadow-sm">
                  <Award className="w-5 h-5 text-cyan-accent dark:text-[#3fb950]" />
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-text-muted">Total Commits</span>
                    <span className="text-lg font-black text-foreground">{totalCommits}</span>
                  </div>
                </div>

                <div className="border border-border p-3.5 bg-background/50 rounded-xl flex items-center gap-3 shadow-sm">
                  <Zap className="w-5 h-5 text-cyan-accent dark:text-[#3fb950]" />
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-text-muted">Active Streak</span>
                    <span className="text-lg font-black text-foreground">{activeStreak} Days</span>
                  </div>
                </div>
              </div>

              {/* Grid Scroll Wrapper */}
              <div className="overflow-x-auto w-full no-scrollbar border border-border/60 bg-background/40 p-4 rounded-xl shadow-inner">
                <div
                  className="grid gap-[3px] md:gap-[4.5px] min-w-[550px]"
                  style={{
                    gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: ROWS }).map((_, r) =>
                    Array.from({ length: COLS }).map((_, c) => {
                      const isSnake = snake.some((p) => p.r === r && p.c === c);
                      const isHead = snake[0] && snake[0].r === r && snake[0].c === c;
                      const isFood = foods.has(`${r},${c}`);

                      let bgClass = getContributionColor(r, c);

                      if (isHead) bgClass = "bg-[#a855f7] dark:bg-[#c084fc] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] z-10 scale-110";
                      else if (isSnake) bgClass = "bg-[#9333ea] dark:bg-[#a855f7] scale-105 z-10";
                      else if (isFood) bgClass = "bg-[#ff5f56] dark:bg-[#ff5f56] drop-shadow-[0_0_6px_rgba(255,95,86,0.6)] animate-pulse z-10 scale-105";

                      return (
                        <div
                          key={`${r}-${c}`}
                          className={`w-[10px] h-[10px] md:w-[11.5px] md:h-[11.5px] rounded-sm transition-all duration-300 ${bgClass}`}
                        />
                      );
                    })
                  )}
                </div>
              </div>

              {/* Legend row */}
              <div className="flex items-center justify-between text-[10px] text-text-muted hh-mono px-1">
                <span>CICD RUNNER: ON-STREAM</span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#ebedf0] dark:bg-[#161b22]" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#c6e48b] dark:bg-[#0e4429]" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#7bc96f] dark:bg-[#006d32]" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#239a3b] dark:bg-[#26a641]" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#196127] dark:bg-[#39d353]" />
                  <span>More</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Block: CI/CD Pipeline Terminal Console Logs */}
          <div className="w-full lg:w-[42%] border-[3px] border-border bg-[#0d1117] text-[#c9d1d9] rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden h-[300px] lg:h-auto min-h-[250px]">
            {/* Console Header Bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#8b949e]">
                <Terminal className="w-3.5 h-3.5 text-cyan-accent dark:text-[#3fb950]" />
                <span>ci-cd-runner.log</span>
              </div>
              <span className="text-[8px] font-mono text-[#58a6ff] border border-[#58a6ff]/30 px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                Running
              </span>
            </div>

            {/* Scrolling Logs Screen */}
            <div className="flex-1 overflow-y-auto font-mono text-[9.5px] leading-relaxed text-[#8b949e] pr-1 space-y-1.5 scrollbar-thin">
              {logs.map((log, i) => {
                let colorClass = "text-[#8b949e]";
                if (log.includes("🚀")) colorClass = "text-cyan-accent dark:text-[#3fb950] font-bold";
                else if (log.includes("trigger")) colorClass = "text-[#ffbd2e]";
                else if (log.includes("verified")) colorClass = "text-[#a371f7]";

                return (
                  <div key={i} className={`${colorClass} whitespace-pre-wrap`}>
                    {log}
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>

            {/* Footer console tags */}
            <div className="border-t border-white/5 pt-3 mt-3 flex justify-between items-center text-[8px] text-[#8b949e] font-mono">
              <span>AGENT: VERIFIED</span>
              <span>HOST: K8S_POD_DEVOPS</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
