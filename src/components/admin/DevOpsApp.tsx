import { useState, useEffect, useRef } from 'react';
import { fetchJson, postJson } from './api';
import { motion } from 'framer-motion';

interface Service {
  name: string;
  provider: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
}

export function DevOpsApp() {
  const [cpu, setCpu] = useState(18);
  const [ram, setRam] = useState(58);
  const [network, setNetwork] = useState(124);
  const [dbStats, setDbStats] = useState({ totalRows: 0, dbTime: '—' });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Simulated metrics loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 25) + 10);
      setRam(Math.floor(Math.random() * 5) + 55);
      setNetwork(Math.floor(Math.random() * 60) + 90);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch db specs
  useEffect(() => {
    fetchJson('/db-status')
      .then((res) => {
        setDbStats({
          totalRows: 0, // Fallback placeholder
          dbTime: res.time ? new Date(res.time).toLocaleTimeString() : 'Unknown'
        });
      })
      .catch(() => {});

    // Also fetch general stats to calculate total rows
    fetchJson('/admin/stats')
      .then((stats) => {
        const total = 
          (stats.todos?.total || 0) + 
          (stats.diary?.total || 0) + 
          (stats.goals?.total || 0) + 
          (stats.messages?.total || 0);
        setDbStats(prev => ({ ...prev, totalRows: total }));
      })
      .catch(() => {});
  }, []);

  // Scroll deploy logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [deployLogs]);

  // Simulate deployment pipeline
  const runSimulatedDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployLogs([]);

    const steps = [
      '⚡ [SYSTEM] Initializing deployment pipeline sequence...',
      '🔗 [GIT] Fetching latest commits from GitHub origin/main...',
      '📦 [BUILD] Installing npm package dependencies (node v20.11.1)...',
      '🔧 [BUILD] Building Next.js application bundles...',
      '✓ [BUILD] Compiled successfully in 1138ms.',
      '🚀 [INFRA] Pushing static serverless edge routes to Vercel CDN...',
      '🔋 [DB] Running Neon Postgres schema sanity verification...',
      '✓ [DB] Connection verified with Neon cluster pooler.',
      '🎉 [SUCCESS] Deployment completed! Webhook listener updated.',
      '🌐 [SYSTEM] Live site running at: https://harshitborana.cloud'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setDeployLogs((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsDeploying(false);
        }
      }, (idx + 1) * 800);
    });
  };

  const services: Service[] = [
    { name: 'App Edge Hosting', provider: 'Vercel CDN', status: 'online', latency: 12 },
    { name: 'Postgres Database', provider: 'Neon Serverless', status: 'online', latency: 45 },
    { name: 'Static File Storage', provider: 'AWS S3 Buckets', status: 'online', latency: 22 },
    { name: 'GitHub Deployment Listener', provider: 'Webhook Hook', status: 'online', latency: 8 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight text-white">DevOps & Infrastructure Monitor</h2>
        <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">Real-time Cloud Node Status</p>
      </div>

      {/* Grid of Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs font-bold text-white/50 uppercase tracking-wider">
            <span>CPU Load</span>
            <span className="text-cyan animate-pulse">● Live</span>
          </div>
          <div className="my-4 flex items-baseline justify-center">
            <span className="text-4xl font-black text-white">{cpu}</span>
            <span className="text-sm text-white/50 font-bold ml-1">%</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-cyan h-full"
              animate={{ width: `${cpu}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* RAM */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs font-bold text-white/50 uppercase tracking-wider">
            <span>Memory Usage</span>
            <span className="text-cyan animate-pulse">● Active</span>
          </div>
          <div className="my-4 flex items-baseline justify-center">
            <span className="text-4xl font-black text-white">{ram}</span>
            <span className="text-sm text-white/50 font-bold ml-1">%</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-[#58a6ff] h-full"
              animate={{ width: `${ram}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Network */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs font-bold text-white/50 uppercase tracking-wider">
            <span>Network IO</span>
            <span className="text-cyan animate-pulse">● Rx/Tx</span>
          </div>
          <div className="my-4 flex items-baseline justify-center">
            <span className="text-4xl font-black text-white">{network}</span>
            <span className="text-xs text-white/50 font-bold ml-1">kB/s</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-[#3fb950] h-full"
              animate={{ width: `${(network / 200) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Services Status */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider border-b border-white/[0.04] pb-2">
            Cloud Nodes Check
          </h3>
          <div className="divide-y divide-white/[0.04] text-xs font-medium">
            {services.map((svc) => (
              <div key={svc.name} className="flex justify-between py-3 items-center">
                <div>
                  <div className="text-white font-bold">{svc.name}</div>
                  <div className="text-[10px] text-white/40 font-mono mt-0.5">{svc.provider}</div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="text-[10px] text-white/40 font-mono">{svc.latency} ms</div>
                  <span className="flex items-center gap-1.5 bg-[#3fb950]/10 text-[#3fb950] font-bold px-2 py-0.5 rounded text-[10px] uppercase border border-[#3fb950]/20 font-mono">
                    <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full animate-ping" />
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Diagnostics */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider border-b border-white/[0.04] pb-2">
              Database Specs
            </h3>
            <div className="space-y-3 mt-4 text-xs font-medium text-white/80">
              <div className="flex justify-between">
                <span className="text-white/40">Engine:</span>
                <span className="font-mono text-cyan">Neon PostgreSQL 16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Active Poolers:</span>
                <span className="font-mono">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Total Records:</span>
                <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-white font-bold">{dbStats.totalRows} Rows</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Diagnostics Time:</span>
                <span className="font-mono text-cyan">{dbStats.dbTime}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.04] text-[10px] text-white/40 font-mono uppercase tracking-wider text-center">
            SSL CONNECTION REQUIRED
          </div>
        </div>
      </div>

      {/* Deployment pipeline trigger console */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">CI/CD Production Deployment</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Webhook Pipeline Emulator</p>
          </div>
          <button
            onClick={runSimulatedDeploy}
            disabled={isDeploying}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
              isDeploying
                ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                : 'bg-cyan text-black border-cyan hover:bg-cyan/90 hover:shadow-[0_0_15px_rgba(0,255,255,0.25)]'
            }`}
          >
            {isDeploying ? 'Deploying...' : 'Trigger Deploy 🚀'}
          </button>
        </div>

        {/* Terminal Screen */}
        <div className="bg-black border border-white/5 rounded-xl p-4 font-mono text-[10px] md:text-xs text-green-400 min-h-[160px] max-h-[220px] overflow-y-auto space-y-1.5 scrollbar-thin">
          {deployLogs.length === 0 ? (
            <div className="text-white/30 italic text-center py-10">
              Terminal Idle. Press &quot;Trigger Deploy&quot; to test your DevOps CI/CD pipeline compile simulation.
            </div>
          ) : (
            deployLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
