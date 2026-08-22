import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Trophy, AlertTriangle } from 'lucide-react';

const LANE_WIDTH = 60;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;
const ROAD_HEIGHT = 400;
const LANES = 3;

// Web Audio API context
let audioCtx: AudioContext | null = null;
let engineOscillator: OscillatorNode | null = null;
let engineGain: GainNode | null = null;

export function CarGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2
  const [obstacles, setObstacles] = useState<{ id: number; lane: number; y: number; text: string }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const gameLoopRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const obstacleTimerRef = useRef<number>(0);
  const obstacleIdCounter = useRef(0);
  
  // Physics state (to avoid dependency cycles)
  const physicsState = useRef({
    score: 0,
    playerLane: 1,
    obstacles: [] as { id: number; lane: number; y: number; text: string }[]
  });

  const BAD_COMMANDS = ['rm -rf /', 'chmod 000', 'kill -9', 'OOM', '502 Error', 'Kernel Panic', 'Drop Table', 'Fork Bomb'];

  // Sync React state to Physics state
  useEffect(() => {
    physicsState.current.playerLane = playerLane;
  }, [playerLane]);

  // Initialize audio
  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  // Engine sound
  const startEngineSound = useCallback(() => {
    if (!soundEnabled || !audioCtx) return;
    if (engineOscillator) engineOscillator.stop();
    
    engineOscillator = audioCtx.createOscillator();
    engineGain = audioCtx.createGain();
    
    engineOscillator.type = 'triangle';
    engineOscillator.frequency.value = 60;
    engineGain.gain.value = 0.1;
    
    engineOscillator.connect(engineGain);
    engineGain.connect(audioCtx.destination);
    engineOscillator.start();
  }, [soundEnabled]);

  const stopEngineSound = () => {
    if (engineOscillator) {
      try { engineOscillator.stop(); } catch(e) {}
      engineOscillator = null;
    }
  };

  const playCrashSound = () => {
    if (!soundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  };

  const playScoreSound = () => {
    if (!soundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  };

  const startGame = () => {
    initAudio();
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setPlayerLane(1);
    setObstacles([]);
    physicsState.current = { score: 0, playerLane: 1, obstacles: [] };
    obstacleIdCounter.current = 0;
    obstacleTimerRef.current = 0;
    lastTimeRef.current = performance.now();
    startEngineSound();
  };

  const stopGame = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    stopEngineSound();
    playCrashSound();
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  }, []);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') {
        setPlayerLane(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setPlayerLane(prev => Math.min(LANES - 1, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Game loop (physics & rendering logic)
  useEffect(() => {
    if (!isPlaying) return;

    const loop = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Update Score
      physicsState.current.score += dt * 20; // 20 points per second
      
      const currentScore = Math.floor(physicsState.current.score);
      const prevScore = Math.floor(physicsState.current.score - dt * 20);
      
      if (currentScore > 0 && currentScore % 100 === 0 && currentScore !== prevScore) {
        playScoreSound();
      }

      const speed = 300 + Math.min(physicsState.current.score, 500);

      // Move obstacles
      let newObstacles = physicsState.current.obstacles.map(obs => ({
        ...obs,
        y: obs.y + speed * dt
      })).filter(obs => obs.y < ROAD_HEIGHT + 100);

      // Collision detection
      const playerY = ROAD_HEIGHT - CAR_HEIGHT - 20;
      const currentLane = physicsState.current.playerLane;
      
      let crashed = false;
      for (const obs of newObstacles) {
        if (
          obs.lane === currentLane &&
          obs.y + CAR_HEIGHT > playerY &&
          obs.y < playerY + CAR_HEIGHT
        ) {
          crashed = true;
          break;
        }
      }

      if (crashed) {
        stopGame();
        return;
      }

      // Spawn new obstacles
      obstacleTimerRef.current += dt;
      const spawnInterval = Math.max(0.4, 1.2 - physicsState.current.score / 1500);
      
      if (obstacleTimerRef.current > spawnInterval) {
        obstacleTimerRef.current = 0;
        const randomLane = Math.floor(Math.random() * LANES);
        const text = BAD_COMMANDS[Math.floor(Math.random() * BAD_COMMANDS.length)];
        newObstacles.push({ id: obstacleIdCounter.current++, lane: randomLane, y: -CAR_HEIGHT, text });
      }

      // Sync refs to React State for rendering (only occasionally to save frames, or every frame)
      physicsState.current.obstacles = newObstacles;
      
      setScore(currentScore);
      setObstacles([...newObstacles]);

      if (engineOscillator) {
        engineOscillator.frequency.setTargetAtTime(60 + currentScore / 20, audioCtx!.currentTime, 0.1);
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, stopGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopEngineSound();
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
      }
    };
  }, []);

  // Update engine sound pitch based on speed/score
  useEffect(() => {
    if (engineOscillator && isPlaying) {
      engineOscillator.frequency.setTargetAtTime(60 + score / 20, audioCtx!.currentTime, 0.1);
    }
  }, [score, isPlaying]);

  return (
    <section 
      id="game" 
      className="w-full py-24 bg-background border-t border-border flex flex-col items-center relative overflow-hidden font-mono"
      style={{
        backgroundImage: "var(--bg-dots)",
        backgroundSize: "24px 24px"
      }}
    >
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scanlines {
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(0,0,0,0.15) 50%,
            rgba(0,0,0,0.15)
          );
          background-size: 100% 4px;
        }
        .crt-curve {
          position: relative;
        }
        .crt-curve::after {
          content: ' ';
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%);
          pointer-events: none;
          z-index: 25;
        }
      `}</style>

      {/* Title Header */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h2 className="hh-title text-4xl md:text-6xl font-black uppercase tracking-tighter flex items-center justify-center gap-3 text-foreground">
          <Trophy className="w-8 h-8 text-cyan-accent dark:text-[#3fb950] animate-bounce" /> 
          TERMINAL RACER
        </h2>
        <span className="hh-mono text-xs md:text-sm font-bold tracking-widest text-[#09692a] dark:text-[#3fb950] uppercase mt-2">
          DODGE THE DEV DEVILS • SECURE THE PIPELINE
        </span>
      </div>

      {/* Main Arcade Frame */}
      <div className="max-w-4xl w-full px-6 flex flex-col lg:flex-row items-center lg:items-stretch gap-10 justify-center">
        
        {/* Left Side: Arcade Machine Console */}
        <div className="relative flex flex-col items-center border-[6px] border-border bg-[#0d1117] rounded-3xl p-6 shadow-2xl overflow-hidden group">
          {/* Wood/neon side borders */}
          <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-b from-cyan-accent via-[#d2a8ff] to-[#3fb950] opacity-80" />
          <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-gradient-to-b from-cyan-accent via-[#d2a8ff] to-[#3fb950] opacity-80" />

          {/* Arcade Cabinet Top Bar */}
          <div className="w-full flex justify-between items-center mb-4 px-2 pb-2 border-b border-white/5 hh-mono text-[10px] text-[#8b949e]">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
              ARCADE STATE: {isGameOver ? "CRASHED" : isPlaying ? "RUNNING" : "READY"}
            </span>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="hover:text-cyan-accent text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>SOUND</span>
            </button>
          </div>

          {/* Curved CRT Screen Bezel */}
          <div className="crt-curve rounded-2xl border-4 border-[#21262d] bg-[#000] p-3 shadow-inner relative">
            
            {/* Real CRT Scanline Effect */}
            <div className="absolute inset-0 scanlines pointer-events-none rounded-xl z-20" />
            <div 
              className="absolute inset-x-0 h-2 bg-white/5 z-20 pointer-events-none"
              style={{
                animation: "scanline 8s linear infinite"
              }}
            />

            {/* Game Screen Canvas Box */}
            <div 
              className="relative bg-black overflow-hidden rounded-xl border border-white/5 shadow-[inset_0_0_30px_rgba(0,255,255,0.2)]"
              style={{ width: LANE_WIDTH * LANES + 20, height: ROAD_HEIGHT }}
            >
              {/* Lane markings */}
              <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-20">
                <div className="w-0.5 h-full border-l border-dashed border-white" />
                <div className="w-0.5 h-full border-l border-dashed border-white" />
              </div>

              {/* Player Car */}
              <motion.div
                className="absolute bottom-[20px] bg-cyan-accent border border-white flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.6)] z-20"
                style={{ 
                  width: CAR_WIDTH, 
                  height: CAR_HEIGHT,
                  borderRadius: "6px 6px 2px 2px",
                }}
                animate={{ x: 10 + playerLane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <div className="w-full h-full relative">
                  <div className="absolute top-1.5 left-1 right-1 h-3 bg-black/40 rounded-sm" />
                  <div className="absolute bottom-3 left-1.5 right-1.5 h-5 bg-black/40 rounded-sm" />
                </div>
              </motion.div>

              {/* Obstacles */}
              {obstacles.map(obs => (
                <div
                  key={obs.id}
                  className="absolute bg-red-600 border border-red-400 shadow-[0_0_15px_rgba(255,0,0,0.6)] flex items-center justify-center z-10"
                  style={{
                    width: CAR_WIDTH,
                    height: CAR_HEIGHT,
                    left: 10 + obs.lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2,
                    top: obs.y,
                    borderRadius: "6px 6px 2px 2px",
                  }}
                >
                   <div className="w-full h-full relative opacity-50">
                     <div className="absolute top-1.5 left-1 right-1 h-3 bg-black/60 rounded-sm" />
                     <div className="absolute bottom-3 left-1.5 right-1.5 h-5 bg-black/60 rounded-sm" />
                   </div>
                   <span className="absolute text-white font-mono font-bold text-[9px] leading-none whitespace-nowrap -rotate-90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pointer-events-none">
                     {obs.text}
                   </span>
                </div>
              ))}

              {/* Overlays */}
              {!isPlaying && !isGameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
                  <button 
                    onClick={startGame}
                    className="px-6 py-3 border-2 border-cyan-accent text-cyan-accent font-bold uppercase tracking-widest hover:bg-cyan-accent hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] active:scale-95 cursor-pointer text-xs"
                  >
                    START ENGINE
                  </button>
                  <p className="text-[10px] text-[#8b949e] mt-4 uppercase">Use ← and → arrows to steer</p>
                </div>
              )}

              {isGameOver && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
                  <AlertTriangle className="w-10 h-10 text-red-500 mb-3 animate-pulse" />
                  <h3 className="text-xl font-black uppercase text-red-500 tracking-widest mb-1">PIPELINE CRASHED</h3>
                  <p className="font-mono text-sm mb-5 text-[#8b949e]">Score: {score}</p>
                  <button 
                    onClick={startGame}
                    className="px-6 py-3 border-2 border-cyan-accent text-cyan-accent font-bold uppercase tracking-widest hover:bg-cyan-accent hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] active:scale-95 cursor-pointer text-xs"
                  >
                    REDEPLOY SYSTEM
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Physical Arcade Cabinet Controller Panel */}
          <div className="w-full mt-6 bg-[#21262d] rounded-2xl p-4 flex justify-between items-center border border-white/5 shadow-inner">
            <div className="flex gap-3">
              <button 
                className="w-12 h-12 bg-[#ff5f56]/10 hover:bg-[#ff5f56]/20 border border-[#ff5f56]/30 text-[#ff5f56] flex items-center justify-center active:scale-90 transition-all rounded-full cursor-pointer"
                onClick={() => isPlaying && playerLane > 0 && setPlayerLane(prev => prev - 1)}
                title="Steer Left"
              >
                <span className="text-xl font-bold">←</span>
              </button>
              <button 
                className="w-12 h-12 bg-[#27c93f]/10 hover:bg-[#27c93f]/20 border border-[#27c93f]/30 text-[#27c93f] flex items-center justify-center active:scale-90 transition-all rounded-full cursor-pointer"
                onClick={() => isPlaying && playerLane < LANES - 1 && setPlayerLane(prev => prev + 1)}
                title="Steer Right"
              >
                <span className="text-xl font-bold">→</span>
              </button>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="hh-mono text-[8px] text-[#8b949e] uppercase">Cabinet Steer Controller</span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right Side: Arcade Leaderboard and Dashboard Status screen */}
        <div className="w-full lg:w-[40%] border-[3px] border-border bg-bg-secondary rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative">
          <div className="absolute inset-2 border border-dashed border-foreground/10 rounded-2xl pointer-events-none" />

          <div className="z-10 flex flex-col gap-5 justify-between h-full py-2">
            <div className="flex flex-col gap-4">
              <span className="hh-mono text-[10px] font-black uppercase text-foreground/50 tracking-wider">
                ▲ SYSTEM DIAGNOSTICS SCREEN
              </span>

              {/* Score Terminal Panel */}
              <div className="border border-border p-4 bg-background/50 rounded-2xl flex flex-col gap-2">
                <span className="hh-mono text-[9px] uppercase tracking-widest text-[#09692a] dark:text-[#3fb950] font-bold">
                  ● PIPELINE TRAFFIC LOAD
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-foreground">{score}</span>
                  <span className="text-xs text-text-muted">OPS/SEC</span>
                </div>
              </div>

              {/* Arcade Specs Logs */}
              <div className="border border-border p-4 bg-background/50 rounded-2xl flex flex-col gap-2.5 hh-mono text-[10px]">
                <div className="flex justify-between border-b border-border pb-1.5">
                  <span className="text-text-muted">HIGH SCORE:</span>
                  <span className="font-bold text-foreground">1,048 (HARSHIT)</span>
                </div>
                <div className="flex justify-between border-b border-border pb-1.5">
                  <span className="text-text-muted">PIPELINE SPEED:</span>
                  <span className="font-bold text-foreground">{5 + Math.floor(score / 50)} MB/s</span>
                </div>
                <div className="flex justify-between border-b border-border pb-1.5">
                  <span className="text-text-muted">DIFFICULTY:</span>
                  <span className={`font-bold ${score > 100 ? 'text-[#ff5f56]' : score > 50 ? 'text-[#ffbd2e]' : 'text-[#27c93f]'}`}>
                    {score > 100 ? "CRITICAL LOAD" : score > 50 ? "MEDIUM LOAD" : "STABLE ROUTING"}
                  </span>
                </div>
              </div>
            </div>

            {/* Retro cabinet instructions panel */}
            <div className="hh-mono text-[9px] text-text-muted leading-relaxed border-t border-border pt-4">
              <div className="mb-2 text-foreground font-bold">HOW TO PLAY:</div>
              Use keyboard <span className="text-foreground">←</span> and <span className="text-foreground">→</span> arrow keys (or the glowing red/green arcade buttons) to dodge fatal system calls like <span className="text-[#ff5f56] font-bold">Fork Bomb</span> and <span className="text-[#ff5f56] font-bold">rm -rf /</span>. Build pipeline uptime for high scores!
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
