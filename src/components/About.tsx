"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { 
  ArrowUpRight, 
  Download, 
  Mail, 
  GitCommit, 
  GitBranch, 
  GitMerge, 
  GitPullRequest,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const profileImage = "/profile.png";
const resumePdf = "/assests/resume.pdf";

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

const LinkedInIcon = ({ className }: { className?: string }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function About() {
  const [expandedCommits, setExpandedCommits] = useState<string[]>(["a1b2c3d"]);
  const toggleCommit = (hash: string) => {
    setExpandedCommits(prev => 
      prev.includes(hash) ? prev.filter(h => h !== hash) : [...prev, hash]
    );
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const timelineData = [
    {
      hash: "a1b2c3d",
      date: "Feb 2026 - Present",
      title: "Trainee DevOps Engineer",
      subtitle: "Kadel Labs",
      description: "Building CI/CD pipelines using GitLab CI/CD, Jenkins, and GitHub Actions. Managing applications on AWS (EC2, S3, IAM), containerizing builds with Docker, and monitoring infrastructure using Prometheus and Grafana.",
      icon: GitCommit,
      color: "text-[#d2a8ff]",
      bgColor: "bg-[#d2a8ff]/10"
    },
    {
      hash: "f4e5d6c",
      date: "April - July 2025",
      title: "DevOps Intern",
      subtitle: "Webanix Solutions",
      description: "Designed robust CI/CD pipelines with Jenkins and Bitbucket. Containerized server setups on AWS EC2, configured NGINX reverse proxies for load balancing/SSL, and integrated AWS IoT Core MQTT communication.",
      icon: GitMerge,
      color: "text-[#a371f7]",
      bgColor: "bg-[#a371f7]/10"
    },
    {
      hash: "9h8g7f6",
      date: "2022 - 2026",
      title: "B.Tech. in Computer Science Engineering",
      subtitle: "Geetanjali Institute of Technical Studies, Udaipur",
      description: "Acquired deep foundations in algorithms, system architecture, and programming. Developed core interests in automation and infrastructure orchestration. CGPA: 8.5 / 10",
      icon: GitBranch,
      color: "text-[#58a6ff]",
      bgColor: "bg-[#58a6ff]/10"
    },
    {
      hash: "j5k4l3m",
      date: "2021 - 2022",
      title: "Class XII - Senior Secondary Education",
      subtitle: "Kendriya Vidyalaya School, Neemuch",
      description: "Completed senior metrics with science and technology focus. Passed with score: 74.4%",
      icon: GitCommit,
      color: "text-[#8b949e]",
      bgColor: "bg-[#8b949e]/10"
    },
    {
      hash: "p2o1n0m",
      date: "2019 - 2020",
      title: "Class X - Secondary Education",
      subtitle: "Spring Wood Sr. Sec School, Neemuch",
      description: "Completed secondary education certifications. Passed with score: 76%",
      icon: GitPullRequest,
      color: "text-[#3fb950]",
      bgColor: "bg-[#3fb950]/10"
    }
  ];

  return (
    <section id="about" ref={containerRef} className="relative w-full py-32 overflow-hidden bg-background">
      <motion.div
        className="absolute top-[20%] right-[-10%] text-[20vw] font-black text-black/[0.03] dark:text-white/[0.03] select-none whitespace-nowrap pointer-events-none tracking-tighter z-0"
        style={{ y: yBg }}
      >
        PROFILE
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 z-10 relative">
        
        {/* Profile Details Grid */}
        <div className="flex flex-col mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            About Me
          </h2>
          <span className="text-lg font-bold tracking-widest text-cyan uppercase opacity-80 mt-2">
            私について / Profile
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mt-8">
          
          {/* Left Box: Biography & Specs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="border-[3px] border-border bg-bg-secondary/20 backdrop-blur-sm rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative"
          >
            <div className="absolute inset-1.5 border border-dashed border-foreground/5 rounded-2xl pointer-events-none" />

            {/* Box Header */}
            <div className="mb-6">
              <span className="text-[10px] font-bold tracking-widest text-[#09692a] dark:text-[#3fb950] uppercase">
                BIOGRAPHY & SPECS
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mt-1">
                Profile Overview
              </h3>
            </div>

            {/* Narrative block */}
            <div className="space-y-4">
              <p className="text-base md:text-lg font-medium leading-relaxed text-foreground">
                Hi there. I&apos;m <span className="text-cyan font-black inline-block -rotate-1">Harshit</span>, a DevOps Engineer who loves to <span className="text-cyan font-black">Build, Innovate, and Automate</span> things. I focus on building robust, scalable infrastructure and seamless deployment pipelines.
              </p>
              <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                When I&apos;m not configuring servers or writing scripts, I&apos;m usually exploring new tech or preparing for my next big challenge. Feel free to connect with me!
              </p>
            </div>

            {/* Spec Frame Row (ID Pass and Terminal side-by-side) */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center my-8">
              {/* ID Pass Photo Frame */}
              <div className="relative w-64 h-[300px] shrink-0 border-2 border-border bg-bg-secondary p-3 rounded-2xl shadow-md flex flex-col justify-between hover:border-cyan-accent transition-colors duration-300">
                <div className="absolute inset-1.5 border border-dashed border-foreground/10 rounded-xl pointer-events-none" />
                
                <div className="flex justify-between items-center px-1 mb-1 z-10 text-[8px] font-bold text-foreground/50 tracking-wider">
                  <span className="text-[8px] font-black tracking-widest text-[#108548] dark:text-[#3fb950] border border-[#108548]/30 dark:border-[#3fb950]/30 px-1.5 py-0.5 rounded uppercase font-mono">
                    SPEAKER
                  </span>
                  <span>HACKER HOUSE GOA</span>
                </div>

                <div className="w-full h-[74%] rounded-lg overflow-hidden border border-border bg-black relative group">
                  <img 
                    src={profileImage} 
                    alt="Harshit Borana Portrait" 
                    className="w-full h-full object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>

                <div className="flex justify-between items-center px-1 z-10 text-[9px] font-bold font-mono tracking-widest text-foreground/80">
                  <span>ID: #HARSHIT-075</span>
                  <svg width="35" height="12" viewBox="0 0 35 12" className="text-foreground opacity-80">
                    <path d="M1 0v12M3 0v12M4 0v12M7 0v12M9 0v12M11 0v12M14 0v12M17 0v12M18 0v12M21 0v12M24 0v12M25 0v12M28 0v12M31 0v12M34 0v12" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>
              </div>

              {/* Spec Sheet Terminal */}
              <div className="w-full sm:w-68 h-[300px] border-2 border-border bg-[#0d1117] text-[#c9d1d9] font-mono text-[11px] rounded-2xl shadow-md flex flex-col overflow-hidden hover:border-cyan-accent/50 transition-colors duration-300">
                <div className="h-8 bg-[#161b22] border-b border-white/5 flex items-center px-3 justify-between shrink-0">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                    <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-[9px] font-bold tracking-widest text-[#8b949e]">profile-specs.sh</span>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between leading-normal select-none">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <span className="text-[#ff79c6] font-bold w-10 shrink-0">HOST:</span>
                      <span className="font-bold text-white text-[11px]">Harshit Borana</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#ff79c6] font-bold w-10 shrink-0">ROLE:</span>
                      <span className="font-bold text-[#58a6ff] text-[11px]">DevOps Engineer</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#ff79c6] font-bold w-10 shrink-0">LOC:</span>
                      <span className="text-[#f1fa8c] text-[11px]">Udaipur</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#ff79c6] font-bold w-10 shrink-0">SHELL:</span>
                      <span className="text-[#8be9fd] text-[11px]">/bin/zsh</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#ff79c6] font-bold w-10 shrink-0">CORE:</span>
                      <span className="text-[#bd93f9] text-[11px]">DevOps</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[9px] text-[#8b949e] shrink-0">
                    <span>UPTIME: 99.999%</span>
                    <span className="text-[#50fa7b] font-bold animate-pulse">● STABLE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social / Resume links row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
              <a
                href={resumePdf}
                download="Harshit_Borana_Resume.pdf"
                className="group p-3 border border-border bg-background/40 hover:bg-background/80 rounded-xl flex items-center justify-between hover:border-cyan-accent transition-all duration-300 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-accent">
                    <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Resume</span>
                    <span className="text-[11px] font-black uppercase text-foreground">Download PDF</span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-foreground/40 group-hover:text-cyan-accent transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="https://www.linkedin.com/in/harshit-borana-🇮🇳-3a685a257/"
                target="_blank"
                rel="noreferrer"
                className="group p-3 border border-border bg-background/40 hover:bg-background/80 rounded-xl flex items-center justify-between hover:border-cyan-accent transition-all duration-300 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-accent">
                    <LinkedInIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">LinkedIn</span>
                    <span className="text-[11px] font-black uppercase text-foreground">Harshit Borana</span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-foreground/40 group-hover:text-cyan-accent transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="https://github.com/harshit075"
                target="_blank"
                rel="noreferrer"
                className="group p-3 border border-border bg-background/40 hover:bg-background/80 rounded-xl flex items-center justify-between hover:border-cyan-accent transition-all duration-300 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-accent">
                    <GithubIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">GitHub</span>
                    <span className="text-[11px] font-black uppercase text-foreground">harshit075</span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-foreground/40 group-hover:text-cyan-accent transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="mailto:harshitborana2@gmail.com"
                className="group p-3 border border-border bg-background/40 hover:bg-background/80 rounded-xl flex items-center justify-between hover:border-cyan-accent transition-all duration-300 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-accent">
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Email</span>
                    <span className="text-[11px] font-black text-foreground lowercase truncate max-w-[100px] sm:max-w-none">
                      harshitborana2
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-foreground/40 group-hover:text-cyan-accent transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>

          {/* Right Box: Experience & Education Git Log Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="border-[3px] border-border bg-bg-secondary/20 backdrop-blur-sm rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative"
          >
            <div className="absolute inset-1.5 border border-dashed border-foreground/5 rounded-2xl pointer-events-none" />

            {/* Box Header */}
            <div className="mb-6">
              <span className="text-[10px] font-bold tracking-widest text-[#d12b6f] dark:text-[#3fb950] uppercase flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-[#d12b6f] dark:text-[#3fb950]" />
                git log --oneline
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mt-1">
                Experience & Education
              </h3>
            </div>

            {/* Terminal Console Block */}
            <div className="flex-1 border-2 border-border bg-[#0d1117] text-[#c9d1d9] rounded-2xl p-4 md:p-5 shadow-inner relative overflow-hidden font-mono text-[11px] md:text-xs leading-relaxed flex flex-col justify-between min-h-[380px]">
              <div className="absolute inset-1 border border-dashed border-white/5 rounded-xl pointer-events-none" />

              <div className="z-10 relative">
                {/* Console Header Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#8b949e]">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                    <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
                    <span className="ml-1">harshit@devops-node: ~/history</span>
                  </div>
                  <span className="text-[8px] text-[#8b949e]">UTF-8</span>
                </div>

                {/* Command Prompt */}
                <div className="flex items-center gap-1.5 mb-3 text-[10px] md:text-[11px]">
                  <span className="text-[#3fb950] font-bold">harshit@devops-node:~$</span>
                  <span className="text-white font-black">git log --oneline</span>
                </div>

                {/* Commits Terminal Output */}
                <div className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                  {timelineData.map((item, index) => {
                    const isExpanded = expandedCommits.includes(item.hash);
                    
                    return (
                      <div key={item.hash} className="flex flex-col border-b border-white/5 pb-1.5 last:border-0">
                        {/* The Oneline Commit Summary Row */}
                        <div 
                          onClick={() => toggleCommit(item.hash)}
                          className="flex flex-wrap items-center gap-1.5 cursor-pointer hover:bg-white/5 p-1 rounded transition-all duration-200"
                        >
                          {/* Commit Hash */}
                          <span className="text-[#d73a49] dark:text-[#f97583] font-bold">
                            {item.hash}
                          </span>
                          
                          {/* Commit Target/Ref tags */}
                          <span className="text-[#22863a] dark:text-[#85e89d] font-bold text-[9px] md:text-[10px]">
                            {index === 0 ? "(HEAD -> main)" : `(tag: v1.${timelineData.length - index})`}
                          </span>

                          {/* Title & Organization */}
                          <span className="text-[#e1e4e8] font-bold text-left">
                            {item.title} @ <span className="text-[#79c0ff]">{item.subtitle}</span>
                          </span>

                          {/* Date details */}
                          <span className="text-[#6a737d] text-[9px] sm:ml-auto">
                            {item.date}
                          </span>
                        </div>

                        {/* Expanded Details Panel */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 pr-1.5 py-2 text-[11px] text-[#8b949e] border-l border-[#58a6ff] bg-white/5 rounded-r mt-0.5 font-sans leading-relaxed flex flex-col gap-1"
                          >
                            <div className="font-mono text-[8px] text-[#ff79c6] uppercase tracking-wider">
                              Commit Metadata
                            </div>
                            <div className="text-white font-medium">
                              {item.description}
                            </div>
                            <div className="flex gap-4 font-mono text-[9px] text-[#8b949e] mt-0.5">
                              <span>Author: Harshit Borana &lt;harshitborana2@gmail.com&gt;</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer info tags */}
              <div className="border-t border-white/5 pt-2 mt-2 flex justify-between items-center text-[8px] text-[#8b949e] font-mono z-10 relative">
                <span>BRANCH: MAIN</span>
                <span>RECORDS: {timelineData.length}</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
