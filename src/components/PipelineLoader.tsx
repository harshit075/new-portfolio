"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronRight, Activity, CheckCircle2, Cpu, Database, Server, Network, Globe } from "lucide-react";

type ServiceStatus = "queued" | "linting" | "building" | "testing" | "deploying" | "success";

interface Microservice {
  id: string;
  name: string;
  status: ServiceStatus;
  progress: number;
  icon: any;
}

const serviceLogs: Record<string, string[]> = {
  "api-gateway": [
    "Gateway: linting check started...",
    "Gateway: lint checks PASSED (0 warnings)",
    "Gateway: compiling gateway configurations...",
    "Gateway: docker build -t gateway:v2.1 .",
    "Gateway: STEP 1/12: FROM node:18-alpine",
    "Gateway: STEP 6/12: RUN yarn build",
    "Gateway: static files optimized (1.2MB)",
    "Gateway: scanning for open vulnerabilities...",
    "Gateway: image vulnerability checks: CLEAN",
    "Gateway: pushing api-gateway:v2.1 to AWS ECR...",
    "Gateway: deploy/api-gateway replica set update init...",
    "Gateway: health status check active: OPERATIONAL"
  ],
  "auth-service": [
    "Auth: starting typescript lint check...",
    "Auth: typescript compiler check: OK",
    "Auth: initializing unit testing database...",
    "Auth: run test suite: Cryptography & JWT Validation",
    "Auth: unit tests: 18 passed, 0 failed",
    "Auth: docker build -t auth-service:v2.0.4 .",
    "Auth: image security scan SonarQube: PASSED",
    "Auth: pushing auth-service:v2.0.4 to ECR...",
    "Auth: patch statefulset/auth-redis config...",
    "Auth: pods updated, service registry connection OK",
    "Auth: health status check active: OPERATIONAL"
  ],
  "order-service": [
    "Order: syntax and code checks: OK",
    "Order: initializing Postgres migration test...",
    "Order: run test suite: Cart & Checkout state machine",
    "Order: DB transaction rollback testing: SUCCESS",
    "Order: unit tests: 32 passed, 0 failed",
    "Order: docker build -t order-service:v1.9.0 .",
    "Order: pushing order-service:v1.9.0 to ECR...",
    "Order: deploying pods to EKS (Namespace: Prod)...",
    "Order: replica set ready (3/3 pods online)",
    "Order: health status check active: OPERATIONAL"
  ],
  "payment-service": [
    "Payment: SonarQube quality gate verification...",
    "Payment: SonarQube metrics: A+ Grade (0 smells)",
    "Payment: mocking secure payment gateway provider...",
    "Payment: running charge & refund transaction tests...",
    "Payment: unit tests: 42 passed, 0 failed",
    "Payment: docker build -t payment-service:v3.2.1 .",
    "Payment: pushing payment-service:v3.2.1 to ECR...",
    "Payment: deploying secure merchant endpoints...",
    "Payment: connection to HSM database verified",
    "Payment: health status check active: OPERATIONAL"
  ],
  "frontend-spa": [
    "Frontend: parsing Next.js layouts and assets...",
    "Frontend: static rendering optimization active...",
    "Frontend: run test suite: UI layouts and rendering",
    "Frontend: UI components testing: 12 passed",
    "Frontend: docker build -t frontend-spa:latest .",
    "Frontend: compiling pages chunk optimization...",
    "Frontend: image assets compression finished",
    "Frontend: pushing frontend-spa:latest to registry...",
    "Frontend: updating global Edge routing rules...",
    "Frontend: invalidating Cloudflare Edge CDN cache...",
    "Frontend: health status check active: OPERATIONAL"
  ]
};

let audioCtx: AudioContext | null = null;

const playTone = (freq = 600, type: OscillatorType = "square", duration = 0.1, vol = 0.03) => {
  if (!audioCtx) return;
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
  if (!audioCtx) return;
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
  if (!audioCtx) return;
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

export function PipelineLoader({ onComplete }: { onComplete: () => void }) {
  const [tick, setTick] = useState(0);
  const [logs, setLogs] = useState<{ id: string; text: string }[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Initialize microservices
  const [services, setServices] = useState<Microservice[]>([
    { id: "api-gateway", name: "api-gateway", status: "queued", progress: 0, icon: Network },
    { id: "auth-service", name: "auth-service", status: "queued", progress: 0, icon: Cpu },
    { id: "order-service", name: "order-service", status: "queued", progress: 0, icon: Database },
    { id: "payment-service", name: "payment-service", status: "queued", progress: 0, icon: Server },
    { id: "frontend-spa", name: "frontend-spa", status: "queued", progress: 0, icon: Globe },
  ]);

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

  // Main simulation timer loop (60 ticks, 1 tick per 90ms = ~5.4 seconds total)
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => {
        if (t >= 60) {
          clearInterval(timer);
          return 60;
        }
        return t + 1;
      });
    }, 90);

    return () => clearInterval(timer);
  }, []);

  // Sync simulation logic based on tick counts
  useEffect(() => {
    if (tick === 0) return;

    if (tick >= 60) {
      // End of pipeline flow: play beautiful arpeggio and trigger completion
      playChord([523.25, 659.25, 783.99, 987.77], "sine", 2.2, 0.06);
      const endTimer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(endTimer);
    }

    const updatedServices = services.map((srv) => {
      let status: ServiceStatus = srv.status;
      let progress = srv.progress;
      let logIndex = -1;

      if (srv.id === "auth-service") {
        if (tick < 10) {
          status = "linting";
          progress = tick * 10;
          logIndex = Math.floor((tick / 10) * 3);
        } else if (tick < 24) {
          status = "building";
          progress = 10 + (tick - 10) * 4.2;
          logIndex = 3 + Math.floor(((tick - 10) / 14) * 3);
        } else if (tick < 38) {
          status = "testing";
          progress = 70 + (tick - 24) * 1.4;
          logIndex = 6 + Math.floor(((tick - 24) / 14) * 2);
        } else if (tick < 48) {
          status = "deploying";
          progress = 90 + (tick - 38) * 1.0;
          logIndex = 8 + Math.floor(((tick - 38) / 10) * 2);
        } else {
          status = "success";
          progress = 100;
          logIndex = 10;
        }
      } 
      else if (srv.id === "api-gateway") {
        if (tick < 12) {
          status = "linting";
          progress = tick * 8.3;
          logIndex = Math.floor((tick / 12) * 3);
        } else if (tick < 28) {
          status = "building";
          progress = 10 + (tick - 12) * 3.75;
          logIndex = 3 + Math.floor(((tick - 12) / 16) * 4);
        } else if (tick < 42) {
          status = "testing";
          progress = 70 + (tick - 28) * 1.4;
          logIndex = 7 + Math.floor(((tick - 28) / 14) * 2);
        } else if (tick < 52) {
          status = "deploying";
          progress = 90 + (tick - 42) * 1.0;
          logIndex = 9 + Math.floor(((tick - 42) / 10) * 2);
        } else {
          status = "success";
          progress = 100;
          logIndex = 11;
        }
      } 
      else if (srv.id === "order-service") {
        if (tick < 8) {
          status = "queued";
          progress = 0;
        } else if (tick < 18) {
          status = "linting";
          progress = (tick - 8) * 10;
          logIndex = Math.floor(((tick - 8) / 10) * 3);
        } else if (tick < 32) {
          status = "building";
          progress = 10 + (tick - 18) * 4.2;
          logIndex = 3 + Math.floor(((tick - 18) / 14) * 3);
        } else if (tick < 46) {
          status = "testing";
          progress = 70 + (tick - 32) * 1.4;
          logIndex = 6 + Math.floor(((tick - 32) / 14) * 2);
        } else if (tick < 54) {
          status = "deploying";
          progress = 90 + (tick - 46) * 1.25;
          logIndex = 8 + Math.floor(((tick - 46) / 8) * 2);
        } else {
          status = "success";
          progress = 100;
          logIndex = 10;
        }
      } 
      else if (srv.id === "payment-service") {
        if (tick < 15) {
          status = "queued";
          progress = 0;
        } else if (tick < 25) {
          status = "linting";
          progress = (tick - 15) * 10;
          logIndex = Math.floor(((tick - 15) / 10) * 3);
        } else if (tick < 38) {
          status = "building";
          progress = 10 + (tick - 25) * 4.6;
          logIndex = 3 + Math.floor(((tick - 25) / 13) * 3);
        } else if (tick < 50) {
          status = "testing";
          progress = 70 + (tick - 38) * 1.6;
          logIndex = 6 + Math.floor(((tick - 38) / 12) * 2);
        } else if (tick < 56) {
          status = "deploying";
          progress = 90 + (tick - 50) * 1.6;
          logIndex = 8 + Math.floor(((tick - 50) / 6) * 2);
        } else {
          status = "success";
          progress = 100;
          logIndex = 10;
        }
      } 
      else if (srv.id === "frontend-spa") {
        if (tick < 20) {
          status = "queued";
          progress = 0;
        } else if (tick < 29) {
          status = "linting";
          progress = (tick - 20) * 11.1;
          logIndex = Math.floor(((tick - 20) / 9) * 3);
        } else if (tick < 42) {
          status = "building";
          progress = 10 + (tick - 29) * 4.6;
          logIndex = 3 + Math.floor(((tick - 29) / 13) * 4);
        } else if (tick < 52) {
          status = "testing";
          progress = 70 + (tick - 42) * 2.0;
          logIndex = 7 + Math.floor(((tick - 42) / 10) * 2);
        } else if (tick < 58) {
          status = "deploying";
          progress = 90 + (tick - 52) * 1.6;
          logIndex = 9 + Math.floor(((tick - 52) / 6) * 2);
        } else {
          status = "success";
          progress = 100;
          logIndex = 10;
        }
      }

      // Check if this status transition requires a tone
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
          // Prevent duplicates
          if (prevLogs.some((l) => l.text === text)) return prevLogs;
          playClick();
          return [...prevLogs, { id: `${srv.id}-${tick}-${logIndex}`, text }];
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
    // Stage activation helpers based on tick
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.8, filter: "brightness(3) blur(30px)" }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center font-mono text-xs p-4 md:p-6"
    >
      {/* Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute top-6 right-6 md:top-8 md:right-8 text-[#8b949e] hover:text-[#c9d1d9] text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors border border-white/5 flex items-center gap-1.5 z-50 cursor-pointer"
      >
        Skip <span className="text-[#58a6ff] border border-[#58a6ff]/30 px-1 rounded text-[8px]">ESC</span>
      </button>

      <div className="w-full max-w-5xl h-[90vh] md:h-[80vh] rounded-2xl overflow-hidden bg-[#050505] border border-white/10 shadow-[0_0_80px_rgba(0,255,255,0.05)] flex flex-col">
        {/* Loader Header */}
        <div className="px-6 py-4 bg-[#0d1117] border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-accent to-transparent opacity-60" />
          
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-accent animate-pulse" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-[#c9d1d9]">CI/CD Pipeline Coordinator</h2>
              <p className="text-[10px] text-[#8b949e]">Microservices Cluster Deploy: Production Environment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-accent animate-ping" />
            <span className="text-[10px] font-bold text-cyan-accent uppercase tracking-widest bg-cyan-accent/10 px-2 py-0.5 border border-cyan-accent/20 rounded">
              Active Run: {Math.round((tick / 60) * 100)}%
            </span>
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
              <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider mb-2 block">Cluster Deploy Status</span>
              
              {services.map((srv) => {
                const IconComponent = srv.icon;
                return (
                  <div key={srv.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 border border-white/5 rounded-lg bg-black/40 gap-3 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-white/5 text-[#8b949e]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#c9d1d9]">{srv.name}</span>
                        <div className="w-28 md:w-40 h-1 bg-[#161b22] rounded-full overflow-hidden mt-1.5">
                          <div 
                            className="h-full bg-cyan-accent transition-all duration-300"
                            style={{ width: `${srv.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-auto md:ml-0">
                      <span className="text-[9px] text-[#8b949e] font-bold">{srv.progress}%</span>
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
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#3fb950]/10 border border-[#3fb950]/20 text-[#3fb950] text-[8px] font-bold tracking-widest uppercase">
                  <div className="w-1 h-1 rounded-full bg-[#3fb950] animate-pulse" />
                  Streaming
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[10px] text-[#8b949e] flex flex-col gap-1.5 pr-2">
                {logs.length === 0 && (
                  <span className="text-[#30363d] italic">&gt; Initializing runner logs...</span>
                )}
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-2 leading-relaxed">
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
        <div className="px-6 py-4 bg-[#0d1117] border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-[#8b949e]">
          <span>Commit Status: <strong className="text-[#58a6ff] font-mono">main:e57fb32</strong></span>
          <span className="font-bold tracking-wider text-cyan-accent">Deploying Cluster to AWS EKS via Kubernetes StatefulSets</span>
        </div>
      </div>
    </motion.div>
  );
}
