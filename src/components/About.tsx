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
  const [showAllLogs, setShowAllLogs] = useState(false);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-8"
          >
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground">
              Hi there. I&apos;m <span className="text-cyan font-black text-2xl inline-block -rotate-2">Harshit</span>, a DevOps Engineer who loves to <span className="text-cyan font-black">Build, Innovate, and Automate</span> things. I focus on building robust, scalable infrastructure and seamless deployment pipelines.
            </p>

            <p className="text-lg md:text-xl text-text-muted leading-relaxed">
              When I&apos;m not configuring servers or writing scripts, I&apos;m usually exploring new tech or preparing for my next big challenge. Feel free to connect with me!
            </p>

            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {/* Resume Link */}
              <a
                href={resumePdf}
                download="Harshit_Borana_Resume.pdf"
                className="group p-4 border border-border bg-bg-secondary/40 backdrop-blur-sm rounded-xl flex items-center justify-between hover:border-cyan-accent transition-colors duration-300 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-accent">
                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Resume</span>
                    <span className="text-xs font-black uppercase text-foreground mt-0.5">Download PDF</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-cyan-accent transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/harshit-borana-🇮🇳-3a685a257/"
                target="_blank"
                rel="noreferrer"
                className="group p-4 border border-border bg-bg-secondary/40 backdrop-blur-sm rounded-xl flex items-center justify-between hover:border-cyan-accent transition-colors duration-300 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-accent">
                    <LinkedInIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">LinkedIn</span>
                    <span className="text-xs font-black uppercase text-foreground mt-0.5">Harshit Borana</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-cyan-accent transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* GitHub Link */}
              <a
                href="https://github.com/harshit075"
                target="_blank"
                rel="noreferrer"
                className="group p-4 border border-border bg-bg-secondary/40 backdrop-blur-sm rounded-xl flex items-center justify-between hover:border-cyan-accent transition-colors duration-300 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-accent">
                    <GithubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">GitHub</span>
                    <span className="text-xs font-black uppercase text-foreground mt-0.5">harshit075</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-cyan-accent transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Email Link */}
              <a
                href="mailto:harshitborana2@gmail.com"
                className="group p-4 border border-border bg-bg-secondary/40 backdrop-blur-sm rounded-xl flex items-center justify-between hover:border-cyan-accent transition-colors duration-300 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-accent">
                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email</span>
                    <span className="text-xs font-black text-foreground mt-0.5 lowercase truncate max-w-[120px] sm:max-w-none">
                      harshitborana2
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-cyan-accent transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-8 justify-center lg:justify-end"
          >
            {/* ID Pass Photo Frame */}
            <div className="relative w-72 h-[340px] shrink-0 border-[3px] border-border bg-bg-secondary p-4 rounded-3xl shadow-2xl flex flex-col justify-between hover:border-cyan-accent transition-colors duration-300">
              <div className="absolute inset-2 border border-dashed border-foreground/15 rounded-2xl pointer-events-none" />
              
              <div className="flex justify-between items-center px-1 mb-1.5 z-10">
                <span className="text-[9px] font-black tracking-widest text-[#108548] dark:text-[#3fb950] border border-[#108548]/30 dark:border-[#3fb950]/30 px-2 py-0.5 rounded uppercase font-mono">
                  SPEAKER
                </span>
                <span className="text-[8px] font-bold text-foreground/50 tracking-wider">HACKER HOUSE GOA</span>
              </div>

              <div className="w-full h-[74%] rounded-xl overflow-hidden border border-border bg-black relative group">
                <img 
                  src={profileImage} 
                  alt="Harshit Borana Portrait" 
                  className="w-full h-full object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-cyan-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              <div className="flex justify-between items-center px-1 mt-1 z-10">
                <span className="text-[10px] font-bold font-mono tracking-widest text-foreground/80">ID: #HARSHIT-075</span>
                <svg width="45" height="15" viewBox="0 0 35 12" className="text-foreground opacity-80">
                  <path d="M1 0v12M3 0v12M4 0v12M7 0v12M9 0v12M11 0v12M14 0v12M17 0v12M18 0v12M21 0v12M24 0v12M25 0v12M28 0v12M31 0v12M34 0v12" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
            </div>

            {/* Spec Sheet Terminal */}
            <div className="w-72 sm:w-80 h-[340px] border-[3px] border-border bg-[#0d1117] text-[#c9d1d9] font-mono text-xs rounded-3xl shadow-2xl flex flex-col overflow-hidden hover:border-cyan-accent/50 transition-colors duration-300">
              <div className="h-10 bg-[#161b22] border-b border-white/5 flex items-center px-4 justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-[#8b949e]">profile-specs.sh</span>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between text-xs leading-relaxed select-none">
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2">
                    <span className="text-[#ff79c6] font-bold w-12 shrink-0">HOST:</span>
                    <span className="font-bold text-white">Harshit Borana</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#ff79c6] font-bold w-12 shrink-0">ROLE:</span>
                    <span className="font-bold text-[#58a6ff]">DevOps Engineer</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#ff79c6] font-bold w-12 shrink-0">LOC:</span>
                    <span className="text-[#f1fa8c]">Udaipur</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#ff79c6] font-bold w-12 shrink-0">SHELL:</span>
                    <span className="text-[#8be9fd]">/bin/zsh</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#ff79c6] font-bold w-12 shrink-0">CORE:</span>
                    <span className="text-[#bd93f9]">DevOps</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[10px] text-[#8b949e]">
                  <span>UPTIME: 99.999%</span>
                  <span className="text-[#50fa7b] font-bold animate-pulse">● STABLE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider line */}
        <div className="w-full h-[2px] bg-border my-20" />

        {/* Combined Experience & Education Git Log Timeline */}
        <div className="max-w-3xl mx-auto relative">
          <div className="flex flex-col mb-16 items-center text-center">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter flex items-center gap-4 text-foreground">
              <GitBranch className="w-8 h-8 text-[#d12b6f] dark:text-[#3fb950]" />
              git log --oneline
            </h2>
            <span className="text-xs md:text-sm font-bold tracking-widest text-[#09692a] dark:text-[#3fb950] uppercase mt-3">
              Experience & Education History
            </span>
          </div>

          {/* Animated Git Branch Line (Clean Left-Aligned) */}
          <div className="absolute left-6 top-24 bottom-0 w-1 bg-border rounded-full overflow-hidden z-0" />

          {/* Timeline Nodes & Cards */}
          <div className="flex flex-col gap-14 pl-14 pt-8">
            {(showAllLogs ? timelineData : timelineData.slice(0, 2)).map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.hash}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative w-full"
                >
                  {/* Left node anchor */}
                  <div className="absolute -left-14 top-2 flex items-center justify-center z-10">
                    <div className={`w-8 h-8 rounded-full border-2 border-background ${item.bgColor} ${item.color} flex items-center justify-center relative shadow-md`}>
                      <Icon className="w-4 h-4" />
                      {/* Pulse ring for latest item */}
                      {index === 0 && (
                        <div className="absolute inset-0 rounded-full border border-[#108548] dark:border-[#3fb950] animate-ping opacity-60" />
                      )}
                    </div>
                  </div>

                  {/* Git Commit Card */}
                  <div className="p-5 md:p-6 rounded-2xl border-2 border-border bg-bg-secondary/40 backdrop-blur-sm hover:border-cyan-accent transition-colors duration-300 shadow-sm relative group">
                    <div className="absolute inset-1.5 border border-dashed border-foreground/5 rounded-xl pointer-events-none" />
                    
                    {/* Git Log Header */}
                    <div className="flex flex-col gap-1 text-[10px] text-foreground/60 dark:text-[#8b949e] font-mono mb-4 border-b border-border pb-3 z-10 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[#108548] dark:text-[#3fb950] font-black uppercase tracking-wider text-xs">
                          commit {item.hash}
                        </span>
                        <span className="bg-foreground/5 dark:bg-white/5 border border-border text-foreground/75 dark:text-white/80 px-2 py-0.5 rounded text-[9px] font-bold">
                          {item.date}
                        </span>
                      </div>
                      <div className="opacity-95">Author: Harshit Borana &lt;harshitborana2@gmail.com&gt;</div>
                    </div>

                    {/* Commit Content */}
                    <div className="z-10 relative pl-1">
                      <h3 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tight leading-none mb-1">
                        {item.title}
                      </h3>
                      <div className="text-xs font-bold text-[#d12b6f] dark:text-cyan-accent uppercase tracking-wider mb-3">
                        {item.subtitle}
                      </div>
                      <p className="text-xs md:text-sm text-foreground/80 dark:text-[#8b949e] leading-relaxed font-sans font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Single Toggle Button */}
          <div className="flex justify-center mt-12 pl-14">
            <button
              onClick={() => setShowAllLogs(!showAllLogs)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-border bg-bg-secondary hover:border-cyan-accent text-xs font-black uppercase tracking-wider text-foreground hover:shadow-[0_0_15px_rgba(88,166,255,0.2)] transition-all duration-300 active:scale-95 z-10"
            >
              {showAllLogs ? (
                <>
                  <ChevronUp className="w-4 h-4 text-cyan-accent dark:text-[#3fb950]" />
                  <span>Collapse Logs</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-cyan-accent dark:text-[#3fb950]" />
                  <span>View All Logs ({timelineData.length - 2} more)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
