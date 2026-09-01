"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Activity, 
  Cpu, 
  Database, 
  Server, 
  Network, 
  Globe, 
  Volume2, 
  VolumeX, 
  FastForward, 
  Play, 
  Pause, 
  Filter, 
  X 
} from "lucide-react";

type ServiceStatus = "queued" | "linting" | "building" | "testing" | "deploying" | "success";
type SpeedMode = "1x" | "2x" | "turbo";

interface Microservice {
  id: string;
  name: string;
  status: ServiceStatus;
  progress: number;
  icon: any;
}

interface LogEntry {
  id: string;
  text: string;
  timestamp: string;
  serviceId?: string;
}

const bootLogs = [
  "SESSION: INITIALIZING PORTFOLIO UPLINK...",
  "CONNECTING TO CLUSTER WORKER NODES...",
  "-------------------------------------------------------",
  "  WELCOME TO HARSHIT BORANA'S DEVOPS PORTFOLIO v2.0.4  ",
  "-------------------------------------------------------",
  "SECURITY PROFILE: SECURE ACCESS GRANTED (GUEST_USER)",
  "ORCHESTRATOR ENGINE: KUBERNETES-EKS-PROD (v1.29.1)",
  "CONTAINER RUNTIME: containerd://1.7.12",
  "POD SUBNETWORK: Calico CNI (IPv4 overlay)",
  "UPLINK STAGE: COGNITO CERTIFICATE HANDSHAKE OK",
  "STATUS: READY. INITIATING PARALLEL PIPELINE BUILD SEQUENCE..."
];

const serviceLogs: Record<string, string[]> = {
  "api-gateway": [
    "Gateway: linting check started...",
    "Gateway: lint checks PASSED (0 warnings, 0 errors)",
    "Gateway: compiling gateway configurations...",
    "Gateway: docker build -t gateway:v2.1 .",
    "Gateway: STEP 1/12: FROM node:18-alpine AS builder",
    "Gateway: STEP 6/12: RUN yarn build",
    "Gateway: static files optimized (1.2MB)",
    "Gateway: scanning for vulnerabilities via Trivy...",
    "Gateway: image vulnerability check: 0 Critical / 0 High",
    "Gateway: pushing api-gateway:v2.1 to ECR registry...",
    "Gateway: deploy/api-gateway replica set update init...",
    "Gateway: EKS service registry connection: OPERATIONAL"
  ],
  "auth-service": [
    "Auth: starting typescript compiler syntax verification...",
    "Auth: typescript compilation checks: OK",
    "Auth: initializing mock database for integration tests...",
    "Auth: running test suite: JWT crypt verification & hashing",
    "Auth: unit tests: 18 passed, 0 failed",
    "Auth: docker build -t auth-service:v2.0.4 .",
    "Auth: image vulnerability check: 0 Critical / 0 High",
    "Auth: pushing auth-service:v2.0.4 to ECR registry...",
    "Auth: patch statefulset/auth-redis config...",
    "Auth: pods updated, service registry connection OK",
    "Auth: EKS service registry connection: OPERATIONAL"
  ],
  "order-service": [
    "Order: syntax and code quality scan: PASSED",
    "Order: spinning up Postgres testing container...",
    "Order: running SQL database migration tests...",
    "Order: checking transaction rollbacks: SUCCESS",
    "Order: unit tests: 32 passed, 0 failed",
    "Order: docker build -t order-service:v1.9.0 .",
    "Order: pushing order-service:v1.9.0 to ECR registry...",
    "Order: deploying manifest files to EKS pods...",
    "Order: replica set ready (3/3 replica pods active)",
    "Order: EKS service registry connection: OPERATIONAL"
  ],
  "payment-service": [
    "Payment: SonarQube quality gate verification...",
    "Payment: SonarQube metrics: A+ Grade (0 smells, 0 bugs)",
    "Payment: mocking Stripe merchant API endpoints...",
    "Payment: executing transaction validation logic...",
    "Payment: unit tests: 42 passed, 0 failed",
    "Payment: docker build -t payment-service:v3.2.1 .",
    "Payment: pushing payment-service:v3.2.1 to ECR registry...",
    "Payment: deploying secure merchant endpoints...",
    "Payment: connection to HSM database verified",
    "Payment: EKS service registry connection: OPERATIONAL"
  ],
  "frontend-spa": [
    "Frontend: parsing Next.js layouts and page assets...",
    "Frontend: static pre-rendering optimization active...",
    "Frontend: running UI test suite: component rendering",
    "Frontend: UI components verification: 12 passed",
    "Frontend: docker build -t frontend-spa:latest .",
    "Frontend: compiling pages chunk optimization...",
    "Frontend: image assets compression finished",
    "Frontend: pushing frontend-spa:latest to registry...",
    "Frontend: updating CDN Edge configurations...",
    "Frontend: invalidating Cloudflare Edge routing cache...",
    "Frontend: EKS service registry connection: OPERATIONAL"
  ]
};

let audioCtx: AudioContext | null = null;
let isAudioMutedGlobal = false;

const playTone = (freq = 600, type: OscillatorType = "square", duration = 0.1, vol = 0.03) => {
  if (isAudioMutedGlobal || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore autoplay block errors
  }
};

const playClick = () => {
  if (isAudioMutedGlobal || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800 + Math.random() * 200, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.008, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  } catch (e) {
    // Ignore autoplay block errors
  }
};

const playChord = (freqs: number[], type: OscillatorType = "sine", duration = 2.0, vol = 0.06) => {
  if (isAudioMutedGlobal || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const ctx = audioCtx;
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const startTime = ctx.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    // Ignore autoplay block errors
  }
};

const getTimestamp = () => {
  const now = new Date();
  const time = now.toTimeString().split(" ")[0];
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `${time}.${ms}`;
};

export function PipelineLoader({ onComplete }: { onComplete: () => void }) {
  const [tick, setTick] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  
  // Interactive control states
  const [phase, setPhase] = useState<"boot" | "pipeline">("boot");
  const [speed, setSpeed] = useState<SpeedMode>("1x");
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [simulatedPing, setSimulatedPing] = useState(12);

  // Sync mute state globally
  useEffect(() => {
    isAudioMutedGlobal = isMuted;
  }, [isMuted]);

  // Micro jitter for simulated latency
  useEffect(() => {
    const pingTimer = setInterval(() => {
      setSimulatedPing(Math.floor(10 + Math.random() * 6));
    }, 1200);
    return () => clearInterval(pingTimer);
  }, []);

  // Initialize microservices
  const [services, setServices] = useState<Microservice[]>([
    { id: "api-gateway", name: "api-gateway", status: "queued", progress: 0, icon: Network },
    { id: "auth-service", name: "auth-service", status: "queued", progress: 0, icon: Cpu },
    { id: "order-service", name: "order-service", status: "queued", progress: 0, icon: Database },
    { id: "payment-service", name: "payment-service", status: "queued", progress: 0, icon: Server },
    { id: "frontend-spa", name: "frontend-spa", status: "queued", progress: 0, icon: Globe },
  ]);

  // Keyboard navigation & accessibility controls: ESC, Space, M, P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: Skip
      if (e.key === "Escape") {
        e.preventDefault();
        onComplete();
      }
      // Space: Toggle speed (1x -> 2x -> turbo -> 1x)
      else if (e.code === "Space") {
        e.preventDefault();
        setSpeed((prev) => (prev === "1x" ? "2x" : prev === "2x" ? "turbo" : "1x"));
        playClick();
      }
      // M: Toggle mute
      else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      }
      // P: Toggle pause
      else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    
    // Auto-initialize audio context
    if (typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }

    // Play initial startup tone
    setTimeout(() => {
      playTone(180, "sawtooth", 0.4, 0.02);
      setTimeout(() => playTone(360, "triangle", 0.4, 0.02), 150);
    }, 200);

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Main simulation timer loop with dynamic speed & pause controls
  // (72 ticks: 0-12 boot screen, 13-72 pipeline graph)
  const intervalMs = isPaused ? null : speed === "turbo" ? 10 : speed === "2x" ? 22 : 40;

  useEffect(() => {
    if (intervalMs === null) return;

    const timer = setInterval(() => {
      setTick((t) => {
        if (t >= 72) {
          clearInterval(timer);
          return 72;
        }
        return t + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  // Sync simulation logic based on tick counts
  useEffect(() => {
    if (tick === 0) return;

    // Phase 1: Boot Sequence
    if (tick <= 12) {
      setPhase("boot");
      const logText = bootLogs[tick - 1];
      if (logText) {
        setLogs((prev) => {
          if (prev.some((l) => l.text === logText)) return prev;
          playClick();
          return [...prev, { id: `boot-${tick}`, text: logText, timestamp: getTimestamp() }];
        });
      }
      return;
    }

    // Transition to pipeline phase when crossing tick 13
    if (tick === 13) {
      setPhase("pipeline");
      setLogs([]); // Clear boot logs to start fresh with deploy logs
      playTone(720, "sine", 0.15, 0.03);
      setTimeout(() => playTone(1080, "sine", 0.15, 0.03), 80);
      return;
    }

    if (tick >= 72) {
      // End of pipeline flow: play beautiful arpeggio and trigger completion
      playChord([523.25, 659.25, 783.99, 987.77], "sine", 2.2, 0.06);
      const endTimer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(endTimer);
    }

    // Map tick offset (14-72) to the building algorithm (0-58 ticks)
    const pipelineTick = tick - 14;

    const updatedServices = services.map((srv) => {
      let status: ServiceStatus = srv.status;
      let progress = srv.progress;
      let logIndex = -1;

      if (srv.id === "auth-service") {
        if (pipelineTick < 10) {
          status = "linting";
          progress = pipelineTick * 10;
          logIndex = Math.floor((pipelineTick / 10) * 3);
        } else if (pipelineTick < 24) {
          status = "building";
          progress = 10 + (pipelineTick - 10) * 4.2;
          logIndex = 3 + Math.floor(((pipelineTick - 10) / 14) * 3);
        } else if (pipelineTick < 38) {
          status = "testing";
          progress = 70 + (pipelineTick - 24) * 1.4;
          logIndex = 6 + Math.floor(((pipelineTick - 24) / 14) * 2);
        } else if (pipelineTick < 48) {
          status = "deploying";
          progress = 90 + (pipelineTick - 38) * 1.0;
          logIndex = 8 + Math.floor(((pipelineTick - 38) / 10) * 2);
        } else {
          status = "success";
          progress = 100;
          logIndex = 10;
        }
      } 
      else if (srv.id === "api-gateway") {
        if (pipelineTick < 12) {
          status = "linting";
          progress = pipelineTick * 8.3;
          logIndex = Math.floor((pipelineTick / 12) * 3);
        } else if (pipelineTick < 28) {
          status = "building";
          progress = 10 + (pipelineTick - 12) * 3.75;
          logIndex = 3 + Math.floor(((pipelineTick - 12) / 16) * 4);
        } else if (pipelineTick < 42) {
          status = "testing";
          progress = 70 + (pipelineTick - 28) * 1.4;
          logIndex = 7 + Math.floor(((pipelineTick - 28) / 14) * 2);
        } else if (pipelineTick < 52) {
          status = "deploying";
          progress = 90 + (pipelineTick - 42) * 1.0;
          logIndex = 9 + Math.floor(((pipelineTick - 42) / 10) * 2);
        } else {
          status = "success";
          progress = 100;
          logIndex = 11;
        }
      } 
      else if (srv.id === "order-service") {
        if (pipelineTick < 8) {
          status = "queued";
          progress = 0;
        } else if (pipelineTick < 18) {
          status = "linting";
          progress = (pipelineTick - 8) * 10;
          logIndex = Math.floor(((pipelineTick - 8) / 10) * 3);
        } else if (pipelineTick < 32) {
          status = "building";
          progress = 10 + (pipelineTick - 18) * 4.2;
          logIndex = 3 + Math.floor(((pipelineTick - 18) / 14) * 3);
        } else if (pipelineTick < 46) {
          status = "testing";
          progress = 70 + (pipelineTick - 32) * 1.4;
          logIndex = 6 + Math.floor(((pipelineTick - 32) / 14) * 2);
        } else if (pipelineTick < 54) {
          status = "deploying";
          progress = 90 + (pipelineTick - 46) * 1.25;
          logIndex = 8 + Math.floor(((pipelineTick - 46) / 8) * 2);
        } else {
          status = "success";
          progress = 100;
          logIndex = 10;
        }
      } 
      else if (srv.id === "payment-service") {
        if (pipelineTick < 15) {
          status = "queued";
          progress = 0;
        } else if (pipelineTick < 25) {
          status = "linting";
          progress = (pipelineTick - 15) * 10;
          logIndex = Math.floor(((pipelineTick - 15) / 10) * 3);
        } else if (pipelineTick < 38) {
          status = "building";
          progress = 10 + (pipelineTick - 25) * 4.6;
          logIndex = 3 + Math.floor(((pipelineTick - 25) / 13) * 3);
        } else if (pipelineTick < 50) {
          status = "testing";
          progress = 70 + (pipelineTick - 38) * 1.6;
          logIndex = 6 + Math.floor(((pipelineTick - 38) / 12) * 2);
        } else if (pipelineTick < 56) {
          status = "deploying";
          progress = 90 + (pipelineTick - 50) * 1.6;
          logIndex = 8 + Math.floor(((pipelineTick - 50) / 6) * 2);
        } else {
          status = "success";
          progress = 100;
          logIndex = 10;
        }
      } 
      else if (srv.id === "frontend-spa") {
        if (pipelineTick < 20) {
          status = "queued";
          progress = 0;
        } else if (pipelineTick < 29) {
          status = "linting";
          progress = (pipelineTick - 20) * 11.1;
          logIndex = Math.floor(((pipelineTick - 20) / 9) * 3);
        } else if (pipelineTick < 42) {
          status = "building";
          progress = 10 + (pipelineTick - 29) * 4.6;
          logIndex = 3 + Math.floor(((pipelineTick - 29) / 13) * 4);
        } else if (pipelineTick < 52) {
          status = "testing";
          progress = 70 + (pipelineTick - 42) * 2.0;
          logIndex = 7 + Math.floor(((pipelineTick - 42) / 10) * 2);
        } else if (pipelineTick < 58) {
          status = "deploying";
          progress = 90 + (pipelineTick - 52) * 1.6;
          logIndex = 9 + Math.floor(((pipelineTick - 52) / 6) * 2);
        } else {
          status = "success";
          progress = 100;
          logIndex = 10;
        }
      }

      // Play sound on status changes
      if (status !== srv.status) {
        if (status === "success") {
          playTone(900, "sine", 0.08, 0.015);
        } else {
          playTone(600, "sine", 0.05, 0.01);
        }
      }

      // Fetch simulated logs
      const serviceLogList = serviceLogs[srv.id];
      if (serviceLogList && logIndex >= 0 && logIndex < serviceLogList.length) {
        const text = serviceLogList[logIndex];
        setLogs((prevLogs) => {
          if (prevLogs.some((l) => l.text === text)) return prevLogs;
          playClick();
          return [...prevLogs, { 
            id: `${srv.id}-${pipelineTick}-${logIndex}`, 
            text, 
            timestamp: getTimestamp(),
            serviceId: srv.id 
          }];
        });
      }

      return { ...srv, status, progress };
    });

    setServices(updatedServices);
  }, [tick]);

  // Scroll console to bottom
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Visual status translations
  const getStatusLabel = (status: ServiceStatus) => {
    switch (status) {
      case "queued": return "Queued";
      case "linting": return "Code Lint";
      case "building": return "Docker Build";
      case "testing": return "Testing";
      case "deploying": return "K8s Deploy";
      case "success": return "Success";
    }
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "queued": return "text-[#8b949e] border-[#30363d] bg-[#30363d]/10";
      case "linting": return "text-[#d29922] border-[#d29922]/30 bg-[#d29922]/5";
      case "building": return "text-[#58a6ff] border-[#58a6ff]/30 bg-[#58a6ff]/5";
      case "testing": return "text-[#bc8cff] border-[#bc8cff]/30 bg-[#bc8cff]/5";
      case "deploying": return "text-[#ff7b72] border-[#ff7b72]/30 bg-[#ff7b72]/5";
      case "success": return "text-[#3fb950] border-[#3fb950]/30 bg-[#3fb950]/5";
    }
  };

  const getStageActiveState = (stageName: string) => {
    if (tick <= 12) return "queued";
    
    if (stageName === "lint") {
      const active = services.some((s) => s.status === "linting");
      const done = services.every((s) => s.status !== "queued" && s.status !== "linting");
      return done ? "done" : active ? "active" : "queued";
    }
    if (stageName === "build") {
      const active = services.some((s) => s.status === "building");
      const done = services.every((s) => s.status !== "queued" && s.status !== "linting" && s.status !== "building");
      return done ? "done" : active ? "active" : "queued";
    }
    if (stageName === "test") {
      const active = services.some((s) => s.status === "testing");
      const done = services.every((s) => s.status !== "queued" && s.status !== "linting" && s.status !== "building" && s.status !== "testing");
      return done ? "done" : active ? "active" : "queued";
    }
    if (stageName === "deploy") {
      const active = services.some((s) => s.status === "deploying");
      const done = services.every((s) => s.status === "success");
      return done ? "done" : active ? "active" : "queued";
    }
    return "queued";
  };

  const getDagNodeStyle = (state: string) => {
    switch (state) {
      case "done": return "border-[#3fb950] text-[#3fb950] bg-[#3fb950]/5 shadow-[0_0_15px_rgba(63,185,80,0.15)]";
      case "active": return "border-[#58a6ff] text-[#58a6ff] bg-[#58a6ff]/10 animate-pulse shadow-[0_0_20px_rgba(88,166,255,0.3)]";
      default: return "border-[#30363d] text-[#8b949e] bg-[#0d1117]";
    }
  };

  const getDagLineStyle = (state: string) => {
    switch (state) {
      case "done": return "bg-[#3fb950]";
      case "active": return "bg-[#58a6ff] animate-pulse";
      default: return "bg-[#30363d]";
    }
  };

  // Filter logs if a specific microservice is clicked
  const displayedLogs = selectedService 
    ? logs.filter((l) => l.serviceId === selectedService || !l.serviceId)
    : logs;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.8, filter: "brightness(3) blur(30px)" }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center font-mono text-xs p-4 md:p-6"
    >
      {/* Scanline cyber overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-50 opacity-25" />

      {/* Persistent Top-Right Controls Bar */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 flex items-center gap-2 z-50">
        {/* Pause/Play Button */}
        <button
          onClick={() => {
            setIsPaused((p) => !p);
            playClick();
          }}
          title={isPaused ? "Resume Simulation [P]" : "Pause Simulation [P]"}
          className="text-[#8b949e] hover:text-[#c9d1d9] bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded transition-colors border border-white/5 flex items-center gap-1 cursor-pointer"
        >
          {isPaused ? (
            <Play className="w-3.5 h-3.5 text-[#3fb950]" />
          ) : (
            <Pause className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline text-[9px] uppercase tracking-wider">{isPaused ? "Resume" : "Pause"}</span>
        </button>

        {/* Speed Selector */}
        <button
          onClick={() => {
            setSpeed((s) => (s === "1x" ? "2x" : s === "2x" ? "turbo" : "1x"));
            playClick();
          }}
          title="Toggle Speed [SPACE]"
          className="text-[#8b949e] hover:text-cyan-accent bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded transition-colors border border-white/5 flex items-center gap-1 cursor-pointer"
        >
          <FastForward className="w-3.5 h-3.5 text-cyan-accent" />
          <span className="text-[9px] font-bold uppercase text-cyan-accent">{speed}</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => setIsMuted((m) => !m)}
          title={isMuted ? "Unmute Audio [M]" : "Mute Audio [M]"}
          className="text-[#8b949e] hover:text-[#c9d1d9] bg-white/5 hover:bg-white/10 p-1.5 rounded transition-colors border border-white/5 flex items-center justify-center cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-[#ff7b72]" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#3fb950]" />
          )}
        </button>

        {/* Skip Button (with ESC key badge) */}
        <button 
          onClick={onComplete}
          title="Skip Intro Sequence [ESC]"
          className="text-[#8b949e] hover:text-[#c9d1d9] text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors border border-white/5 flex items-center gap-1.5 cursor-pointer"
        >
          Skip <span className="text-[#58a6ff] border border-[#58a6ff]/30 px-1 rounded text-[8px]">ESC</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {phase === "boot" ? (
          // PHASE 1: Boot Splash Screen (Welcome Screen)
          <motion.div
            key="boot-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(5px)" }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-[#030303] border border-cyan-accent/20 rounded-xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,255,255,0.03)] flex flex-col justify-between min-h-[380px] relative overflow-hidden"
          >
            {/* Visual borders decoration */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-accent/60" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-accent/60" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-accent/60" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-accent/60" />
            
            <div className="flex items-center justify-between border-b border-cyan-accent/10 pb-4">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-accent animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-[#8b949e]">CLUSTER HOST GATEWAY // SECURE</span>
              </div>
              <span className="text-[9px] font-bold text-cyan-accent uppercase tracking-widest bg-cyan-accent/10 px-2 py-0.5 border border-cyan-accent/20 rounded font-mono">
                Booting ({Math.min(100, Math.round((tick / 12) * 100))}%)
              </span>
            </div>

            {/* Simulated typing printouts */}
            <div className="flex-1 my-6 flex flex-col gap-1.5 overflow-hidden justify-center font-mono text-[11px] leading-relaxed">
              {logs.map((log) => {
                const isHeading = log.text.includes("---") || log.text.includes("WELCOME");
                return (
                  <div key={log.id} className="flex items-baseline gap-2">
                    <span className="text-[9px] text-[#484f58] select-none font-mono">[{log.timestamp}]</span>
                    <span className="text-cyan-accent select-none">&gt;</span>
                    <span className={`break-all ${isHeading ? "text-cyan-accent font-black tracking-wider" : "text-[#c9d1d9]"}`}>{log.text}</span>
                  </div>
                );
              })}
              <div className="w-1.5 h-3 bg-cyan-accent animate-pulse mt-0.5" />
            </div>

            {/* Boot phase progress bar */}
            <div className="w-full bg-[#161b22] h-1.5 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-cyan-accent/60 to-cyan-accent transition-all duration-150"
                style={{ width: `${Math.min(100, Math.round((tick / 12) * 100))}%` }}
              />
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[9px] text-[#8b949e]">
              <span>NODE: <strong className="text-cyan-accent font-mono">mac-client-uplink</strong></span>
              <span className="flex items-center gap-2">
                <span>LATENCY: <strong className="text-[#3fb950] font-mono">{simulatedPing}ms</strong></span>
                <span>EST: {speed === "turbo" ? "0.3S" : speed === "2x" ? "0.6S" : "1.2S"}</span>
              </span>
            </div>
          </motion.div>
        ) : (
          // PHASE 2: Production CI/CD Dashboard (Coordinator Console)
          <motion.div 
            key="pipeline-screen"
            initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl h-[92vh] md:h-[82vh] rounded-2xl overflow-hidden bg-[#050505] border border-white/10 shadow-[0_0_80px_rgba(0,255,255,0.05)] flex flex-col relative"
          >
            {/* Loader Header */}
            <div className="px-6 py-4 bg-[#0d1117] border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-accent to-transparent opacity-60" />
              
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-cyan-accent animate-pulse" />
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-[#c9d1d9]">CI/CD Pipeline Coordinator</h2>
                  <p className="text-[10px] text-[#8b949e]">Microservices Cluster Deploy: Production Environment (AWS EKS)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/5 rounded text-[9px] text-[#8b949e]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
                  <span>Ping: <strong className="text-[#3fb950]">{simulatedPing}ms</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-accent animate-ping" />
                  <span className="text-[10px] font-bold text-cyan-accent uppercase tracking-widest bg-cyan-accent/10 px-2 py-0.5 border border-cyan-accent/20 rounded">
                    Active Run: {Math.min(100, Math.round(((tick - 13) / 59) * 100))}%
                  </span>
                </div>
              </div>
            </div>

            {/* Loader Body */}
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col p-6 gap-6">
              {/* Top Row: Pipeline Flowchart DAG */}
              <div className="w-full bg-[#0d1117]/60 border border-white/5 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
                {/* Stage 1 */}
                <div className={`px-4 py-2 border rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-center w-full md:w-auto ${getDagNodeStyle(getStageActiveState("lint"))}`}>
                  1. Code Lint & Format
                </div>
                <div className={`h-1 md:h-0.5 flex-1 w-0.5 md:w-auto ${getDagLineStyle(getStageActiveState("build"))}`} />
                
                {/* Stage 2 */}
                <div className={`px-4 py-2 border rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-center w-full md:w-auto ${getDagNodeStyle(getStageActiveState("build"))}`}>
                  2. Parallel Build
                </div>
                <div className={`h-1 md:h-0.5 flex-1 w-0.5 md:w-auto ${getDagLineStyle(getStageActiveState("test"))}`} />
                
                {/* Stage 3 */}
                <div className={`px-4 py-2 border rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-center w-full md:w-auto ${getDagNodeStyle(getStageActiveState("test"))}`}>
                  3. SonarQube & Tests
                </div>
                <div className={`h-1 md:h-0.5 flex-1 w-0.5 md:w-auto ${getDagLineStyle(getStageActiveState("deploy"))}`} />
                
                {/* Stage 4 */}
                <div className={`px-4 py-2 border rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-center w-full md:w-auto ${getDagNodeStyle(getStageActiveState("deploy"))}`}>
                  4. K8s Cluster Deploy
                </div>
              </div>

              {/* Middle Row: Split View */}
              <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Microservices statuses */}
                <div className="flex flex-col gap-3 bg-[#0d1117]/30 border border-white/5 rounded-xl p-4 overflow-y-auto">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">
                      Cluster Deploy Status
                    </span>
                    <span className="text-[9px] text-[#8b949e]">
                      (Click service to filter logs)
                    </span>
                  </div>
                  
                  {services.map((srv) => {
                    const IconComponent = srv.icon;
                    const isSelected = selectedService === srv.id;

                    return (
                      <div 
                        key={srv.id} 
                        onClick={() => setSelectedService((prev) => (prev === srv.id ? null : srv.id))}
                        className={`flex flex-col md:flex-row md:items-center justify-between p-3 border rounded-lg bg-black/40 gap-3 transition-all cursor-pointer ${
                          isSelected 
                            ? "border-cyan-accent shadow-[0_0_15px_rgba(0,255,255,0.15)] bg-cyan-accent/5" 
                            : "border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-md ${isSelected ? "bg-cyan-accent/20 text-cyan-accent" : "bg-white/5 text-[#8b949e]"}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${isSelected ? "text-cyan-accent" : "text-[#c9d1d9]"}`}>{srv.name}</span>
                              {isSelected && (
                                <span className="text-[8px] bg-cyan-accent/20 text-cyan-accent px-1.5 py-0.2 rounded font-mono uppercase">Filtered</span>
                              )}
                            </div>
                            <div className="w-28 md:w-40 h-1 bg-[#161b22] rounded-full overflow-hidden mt-1.5">
                              <div 
                                className="h-full bg-cyan-accent transition-all duration-300"
                                style={{ width: `${srv.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-auto md:ml-0">
                          <span className="text-[9px] text-[#8b949e] font-bold">{Math.round(srv.progress)}%</span>
                          <span className={`px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide transition-all duration-300 ${getStatusColor(srv.status)}`}>
                            {getStatusLabel(srv.status)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Console Live Logger */}
                <div className="bg-black/60 border border-white/5 rounded-xl p-4 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-cyan-accent" />
                      <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Deploy Console Stream</span>
                      {selectedService && (
                        <span className="text-[9px] text-cyan-accent bg-cyan-accent/10 px-2 py-0.5 rounded border border-cyan-accent/20 flex items-center gap-1">
                          <Filter className="w-2.5 h-2.5" />
                          {selectedService}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedService(null);
                            }}
                            className="hover:text-white ml-0.5"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedService && (
                        <button
                          onClick={() => setSelectedService(null)}
                          className="text-[8px] text-[#8b949e] hover:text-white underline cursor-pointer"
                        >
                          Show All
                        </button>
                      )}
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#3fb950]/10 border border-[#3fb950]/20 text-[#3fb950] text-[8px] font-bold tracking-widest uppercase">
                        <div className="w-1 h-1 rounded-full bg-[#3fb950] animate-pulse" />
                        {isPaused ? "Paused" : "Streaming"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[10px] text-[#8b949e] flex flex-col gap-1.5 pr-2">
                    {displayedLogs.length === 0 && (
                      <span className="text-[#30363d] italic">&gt; Initializing runner logs...</span>
                    )}
                    {displayedLogs.map((log) => (
                      <div key={log.id} className="flex items-baseline gap-2 leading-relaxed">
                        <span className="text-[8px] text-[#484f58] select-none font-mono">[{log.timestamp}]</span>
                        <span className="text-cyan-accent select-none">&gt;</span>
                        <span className="text-[#c9d1d9] break-all">{log.text}</span>
                      </div>
                    ))}
                    <div ref={consoleEndRef} />
                  </div>
                </div>
              </div>
            </div>

            {/* Loader Footer */}
            <div className="px-6 py-3 bg-[#0d1117] border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-[#8b949e]">
              <div className="flex items-center gap-3">
                <span>Commit: <strong className="text-[#58a6ff] font-mono">main:e57fb32</strong></span>
                <span className="text-[#484f58] hidden sm:inline">|</span>
                <span className="hidden sm:inline">EKS Nodes: <strong className="text-[#3fb950] font-mono">3/3 Ready</strong></span>
              </div>

              {/* Keyboard shortcuts hints */}
              <div className="flex items-center gap-3 text-[9px] text-[#6e7681]">
                <span><kbd className="text-[#58a6ff] border border-[#58a6ff]/30 px-1 py-0.5 rounded text-[8px]">ESC</kbd> Skip</span>
                <span><kbd className="text-cyan-accent border border-cyan-accent/30 px-1 py-0.5 rounded text-[8px]">SPACE</kbd> Speed</span>
                <span><kbd className="text-[#3fb950] border border-[#3fb950]/30 px-1 py-0.5 rounded text-[8px]">P</kbd> Pause</span>
                <span><kbd className="text-[#bc8cff] border border-[#bc8cff]/30 px-1 py-0.5 rounded text-[8px]">M</kbd> Mute</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
