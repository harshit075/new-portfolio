"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, ExternalLink, Code2, MonitorPlay } from "lucide-react";

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

type ProjectType = {
  num: string;
  title: string;
  description: string;
  device: "mobile" | "laptop";
  github?: string;
  live?: string;
  tags: string[];
  iacCode: string;
};

const projectsData: ProjectType[] = [
  {
    num: "01",
    title: "Jenkins Shared Library Pipeline",
    description:
      "Enterprise-grade custom Jenkins Shared Library automating end-to-end CI/CD for multi-service microservices. Standardizes testing, security scanning, containerization, and canary Kubernetes deployments across all business units.",
    device: "laptop",
    tags: ["Jenkins", "Groovy", "Kubernetes", "Helm", "CI/CD", "Docker"],
    iacCode: `// vars/microservicePipeline.groovy
def call(Map config = [:]) {
  pipeline {
    agent { label 'docker-runner' }
    options {
      timeout(time: 1, unit: 'HOURS')
      ansiColor('xterm')
      disableConcurrentBuilds()
    }
    stages {
      stage('Security Scan') {
        steps {
          sh "trivy image --severity HIGH,CRITICAL \${config.imageName}:\${env.BUILD_ID}"
        }
      }
      stage('Docker Build & Push') {
        steps {
          script {
            docker.withRegistry("https://\${config.registry}", 'ecr-credentials') {
              def image = docker.build("\${config.appName}:\${env.BUILD_NUMBER}")
              image.push()
            }
          }
        }
      }
      stage('GitOps Sync') {
        steps {
          dir('gitops-manifests') {
            git url: 'git@github.com:org/gitops.git', branch: 'main'
            sh "kustomize edit set image \${config.appName}=\${config.registry}/\${config.appName}:\${env.BUILD_NUMBER}"
            sh "git commit -am 'infra: bump \${config.appName} to \${env.BUILD_NUMBER}' && git push"
          }
        }
      }
    }
  }
}`,
  },
  {
    num: "02",
    title: "Multi-Cluster EKS GitOps Platform",
    description:
      "Automated provisioning of production-grade AWS EKS clusters using Terraform. Configured with ArgoCD for declarative GitOps continuous delivery, Prometheus/Grafana for monitoring, and External Secrets Operator.",
    device: "laptop",
    github: "https://github.com/harshit075/eks-gitops-infrastructure",
    live: "https://argocd.demo.harshitdev.ops",
    tags: ["Terraform", "AWS EKS", "ArgoCD", "Prometheus", "Helm"],
    iacCode: `module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "production-eks-cluster"
  cluster_version = "1.29"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      min_size       = 3
      max_size       = 10
      desired_size   = 3
      instance_types = ["t3.xlarge"]
    }
  }
}`,
  },
  {
    num: "03",
    title: "AWS Event-Driven Serverless Pipeline",
    description:
      "A highly resilient serverless data processing pipeline utilizing AWS Lambda, SQS, ECS Fargate, and DynamoDB. Implements auto-scaling policies based on SQS queue depth with Datadog monitoring.",
    device: "laptop",
    github: "https://github.com/harshit075/aws-serverless-pipeline",
    live: "https://datadog.demo.harshitdev.ops",
    tags: ["AWS Lambda", "ECS Fargate", "SQS", "DynamoDB", "Datadog"],
    iacCode: `version: "3.8"
services:
  data-processor:
    image: internal-registry/processor:v1.2.0
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    environment:
      - SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/12345/data-queue
      - DYNAMODB_TABLE=processed-data-store`,
  },
  {
    num: "04",
    title: "Zero-Trust Secure K8s Service Mesh",
    description:
      "Implementation of a secure service mesh using Istio across multiple Kubernetes clusters. Features mTLS-by-default communication, fine-grained canary traffic routing, and secure ingress gateways via cert-manager.",
    device: "laptop",
    github: "https://github.com/harshit075/secure-k8s-mesh",
    live: "https://istio.demo.harshitdev.ops",
    tags: ["Istio", "Kubernetes", "cert-manager", "mTLS", "Ingress"],
    iacCode: `apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT
---
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: secure-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: wildcard-cert
    hosts:
    - "*.harshitdev.ops"`,
  },
];

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section id="projects" ref={containerRef} className="relative w-full min-h-screen py-32 overflow-hidden bg-background">
      <motion.div
        className="absolute top-0 right-[-10%] text-[20vw] font-black text-black/[0.03] dark:text-white/[0.03] select-none whitespace-nowrap pointer-events-none tracking-tighter"
        style={{ y: yBg }}
      >
        プロジェクト
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 z-10 relative">
        <div className="flex flex-col mb-24">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Selected Works
          </h2>
          <span className="text-lg font-bold tracking-widest text-[#58a6ff] uppercase opacity-80 mt-2">
            Infrastructure & Code
          </span>
        </div>

        <div className="space-y-40">
          {projectsData.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <ProjectCard key={project.num} project={project} isEven={isEven} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectMockup({ num, title }: { num: string; title: string }) {
  if (num === "01") {
    return (
      <div className="w-full h-full flex flex-col bg-[#0d1117] text-left font-mono text-[10px] md:text-xs text-[#c9d1d9] p-4 md:p-6 pt-12 select-none overflow-hidden border-b border-white/5">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-[#8b949e] text-[9px] md:text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
            pipeline-execution.log
          </span>
          <span className="text-[#3fb950] font-bold">BUILD SUCCESSFUL</span>
        </div>
        <div className="flex-1 space-y-1.5 overflow-y-auto pr-2 scrollbar-none opacity-85">
          <div className="text-[#8b949e]">[Pipeline] Start Pipeline</div>
          <div className="text-[#8b949e]">[Pipeline] node (jenkins-agent-arm64)</div>
          <div>
            <span className="text-[#58a6ff]">[STAGE] Static Analysis</span>
            <div className="pl-4 text-[#8b949e]">&gt; Run SonarQube Scanner...</div>
            <div className="pl-4 text-[#3fb950]">&gt; Quality Gate Passed (0 errors)</div>
          </div>
          <div>
            <span className="text-[#58a6ff]">[STAGE] Vulnerability Scan</span>
            <div className="pl-4 text-[#8b949e]">&gt; Trivy Scan container image...</div>
            <div className="pl-4 text-[#3fb950]">&gt; 0 Critical, 0 High Vulnerabilities</div>
          </div>
          <div>
            <span className="text-[#58a6ff]">[STAGE] Build & Push</span>
            <div className="pl-4 text-[#8b949e]">&gt; Building container layers...</div>
            <div className="pl-4 text-[#3fb950]">&gt; Pushed to ecr.us-east-1.amazonaws.com</div>
          </div>
          <div>
            <span className="text-[#58a6ff]">[STAGE] GitOps Sync</span>
            <div className="pl-4 text-[#8b949e]">&gt; Update Helm Tag to #1024</div>
            <div className="pl-4 text-[#3fb950]">&gt; ArgoCD Auto-Sync triggered successfully</div>
          </div>
          <div className="text-[#3fb950] font-bold pt-1">[Pipeline] End: SUCCESS in 42s</div>
        </div>
      </div>
    );
  }

  if (num === "02") {
    return (
      <div className="w-full h-full flex flex-col bg-[#0b0e14] text-left font-mono text-[10px] md:text-xs text-[#c9d1d9] p-4 md:p-6 pt-12 select-none overflow-hidden border-b border-white/5">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-[#8b949e] text-[9px] md:text-[10px]">
          <span>argocd-dashboard --app production</span>
          <span className="bg-[#3fb950]/10 border border-[#3fb950]/30 text-[#3fb950] px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
            Synced
          </span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-2 opacity-85">
          <div className="flex items-center gap-2 bg-white/5 p-2 border border-white/5 rounded-lg">
            <div className="w-3.5 h-3.5 rounded-full bg-[#3fb950]/20 border border-[#3fb950]/40 flex items-center justify-center text-[8px] text-[#3fb950] font-bold">✓</div>
            <div className="flex flex-col">
              <span className="font-bold text-[#c9d1d9] text-[10px] md:text-xs">eks-prod-cluster</span>
              <span className="text-[#8b949e] text-[8px]">application.argoproj.io</span>
            </div>
          </div>
          
          <div className="pl-4 border-l border-white/10 space-y-2">
            <div className="flex items-center gap-2 bg-white/5 p-1.5 border border-white/5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#3fb950]" />
              <div className="flex flex-col">
                <span className="font-bold text-[#c9d1d9] text-[9px] md:text-[10px]">argocd-ingress-gateway</span>
                <span className="text-[#8b949e] text-[8px]">Service / Ingress</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 p-1.5 border border-white/5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
              <div className="flex flex-col">
                <span className="font-bold text-[#c9d1d9] text-[9px] md:text-[10px]">microservices-deployment</span>
                <span className="text-[#8b949e] text-[8px]">Deployment (3 Replicas)</span>
              </div>
            </div>
            
            <div className="pl-5 flex gap-1.5">
              <span className="text-[8px] bg-[#3fb950]/15 border border-[#3fb950]/30 text-[#3fb950] px-1.5 py-0.5 rounded font-bold">pod/api-x82m</span>
              <span className="text-[8px] bg-[#3fb950]/15 border border-[#3fb950]/30 text-[#3fb950] px-1.5 py-0.5 rounded font-bold">pod/api-p01s</span>
              <span className="text-[8px] bg-[#3fb950]/15 border border-[#3fb950]/30 text-[#3fb950] px-1.5 py-0.5 rounded font-bold">pod/api-q92k</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (num === "03") {
    return (
      <div className="w-full h-full flex flex-col bg-[#0b0e14] text-left font-mono text-[10px] md:text-xs text-[#c9d1d9] p-4 md:p-6 pt-12 select-none overflow-hidden border-b border-white/5">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-[#8b949e] text-[9px] md:text-[10px]">
          <span>aws-metrics-monitor</span>
          <span className="text-[#58a6ff] animate-pulse font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]" /> LIVE STREAM
          </span>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3 items-center opacity-85">
          <div className="space-y-2">
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="text-[8px] text-[#8b949e] uppercase block">SQS Queue Depth</span>
              <span className="text-xs md:text-sm font-bold text-[#ffbd2e]">124 Messages</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="text-[8px] text-[#8b949e] uppercase block">Fargate Tasks Scale</span>
              <span className="text-xs md:text-sm font-bold text-[#3fb950]">8 running / 10 max</span>
            </div>
          </div>
          
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 h-[90%] flex flex-col justify-between">
            <span className="text-[8px] text-[#8b949e] uppercase block mb-1">Throughput</span>
            <div className="flex-1 flex flex-col justify-end gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-[#8b949e] w-8">Proc:</span>
                <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#3fb950] h-full rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-[#8b949e] w-8">Errors:</span>
                <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#ff5f56] h-full rounded-full" style={{ width: "2%" }} />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-[#8b949e] w-8">Lag:</span>
                <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#ffbd2e] h-full rounded-full" style={{ width: "42%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (num === "04") {
    return (
      <div className="w-full h-full flex flex-col bg-[#0b0e14] text-left font-mono text-[10px] md:text-xs text-[#c9d1d9] p-4 md:p-6 pt-12 select-none overflow-hidden border-b border-white/5">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-[#8b949e] text-[9px] md:text-[10px]">
          <span>istio-security-mesh</span>
          <span className="text-[#3fb950] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
            mTLS: STRICT
          </span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-2 opacity-85">
          <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-[#3fb950]/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#3fb950]/5" />
            <div className="flex flex-col z-10">
              <span className="font-bold text-[9px] text-[#c9d1d9]">Ingress Gateway</span>
              <span className="text-[8px] text-[#8b949e]">HTTPS Router</span>
            </div>
            <div className="flex items-center gap-1 text-[#3fb950] z-10 text-[9px] font-bold animate-pulse">
              <span>••••</span>
              <span className="text-[8px]">🔒</span>
              <span>••••&gt;</span>
            </div>
            <div className="flex flex-col text-right z-10">
              <span className="font-bold text-[9px] text-[#c9d1d9]">istio-proxy</span>
              <span className="text-[8px] text-[#3fb950]">Authenticated</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center gap-2 mt-1">
            <div className="flex-1 bg-white/5 p-1.5 rounded-lg border border-white/5 text-center">
              <span className="text-[8px] text-[#8b949e] block">Service A (v1)</span>
              <span className="text-[9px] text-[#3fb950] font-bold">90% Traffic</span>
            </div>
            <div className="flex-1 bg-white/5 p-1.5 rounded-lg border border-[#58a6ff]/30 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#58a6ff]/5" />
              <span className="text-[8px] text-[#8b949e] block z-10 relative">Service A (Canary)</span>
              <span className="text-[9px] text-[#58a6ff] font-bold z-10 relative">10% Traffic</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
      <span className="text-text-muted uppercase text-xs font-bold tracking-widest px-4 text-center group-hover:text-[#58a6ff] transition-colors">
        {title} Interface
      </span>
    </div>
  );
}

function ProjectCard({ project, isEven }: { project: ProjectType; isEven: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showIac, setShowIac] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1", "1.2 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      className={`relative flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20 ${
        !isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-baseline gap-4">
            <span className="text-6xl md:text-8xl font-black text-transparent [-webkit-text-stroke:2px_var(--foreground)] opacity-20">
              {project.num}
            </span>
            <h3 className="text-3xl md:text-5xl font-bold uppercase">{project.title}</h3>
          </div>
          <span className="text-sm font-bold tracking-widest text-[#58a6ff] uppercase opacity-80">
            {project.device === "mobile" ? "モバイルアプリ / Mobile App" : "ウェブシステム / Web System"}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 border border-border-color text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-lg md:text-xl text-text-muted mb-8 leading-relaxed max-w-lg">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-4 mt-2 items-center">
          {/* GitHub Button */}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center gap-3 px-6 py-3 border-2 border-foreground font-bold uppercase tracking-widest overflow-hidden transition-all hover:border-[#58a6ff] hover:text-black hover:shadow-[0_0_20px_rgba(88,166,255,0.3)]"
            >
              <div className="absolute inset-0 bg-[#58a6ff] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0" />
              <GithubIcon className="w-4 h-4 relative z-10 group-hover:text-black transition-colors" />
              <span className="relative z-10 group-hover:text-black transition-colors">GitHub</span>
            </a>
          )}

          {/* Live Demo Button */}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center gap-3 px-6 py-3 bg-foreground text-background font-bold uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(88,166,255,0.3)]"
            >
              <div className="absolute inset-0 bg-[#58a6ff] transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0" />
              <span className="relative z-10 group-hover:text-black transition-colors">Live Demo</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:text-black transition-all" />
            </a>
          )}

          {/* IaC Toggle */}
          <button
            onClick={() => setShowIac(!showIac)}
            className="ml-auto group flex items-center gap-2 px-4 py-3 bg-[#161b22] border border-white/10 hover:border-[#58a6ff]/50 rounded-lg transition-colors"
          >
            {showIac ? (
              <MonitorPlay className="w-4 h-4 text-[#58a6ff]" />
            ) : (
              <Code2 className="w-4 h-4 text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" />
            )}
            <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${showIac ? 'text-[#58a6ff]' : 'text-[#8b949e] group-hover:text-[#c9d1d9]'}`}>
              {showIac ? "View UI" : "View IaC"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center relative perspective-[1000px]">
        <motion.div 
          className={`relative w-full preserve-3d transition-all duration-700 ${project.device === "mobile" ? "w-[240px] md:w-[300px] aspect-[9/19]" : "aspect-[16/10]"}`}
          animate={{ rotateY: showIac ? 180 : 0 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front (UI Mockup) */}
          <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: "hidden" }}>
            <div className="absolute inset-0 border-2 border-border-color rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden bg-[#0d1117] flex flex-col hover:border-[#58a6ff]/50 transition-colors duration-500 hover:shadow-[0_0_30px_rgba(88,166,255,0.1)]">
              {/* Simulated browser chrome for laptop */}
              {project.device === "laptop" && (
                <div className="absolute top-0 left-0 right-0 h-8 bg-border-color/30 flex items-center px-4 gap-1.5 z-20 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-[10px] text-[#8b949e] font-mono ml-4 select-none opacity-60">localhost:3000</span>
                </div>
              )}
              {/* Simulated notch for mobile */}
              {project.device === "mobile" && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-border-color/50 z-20" />
              )}
              <ProjectMockup num={project.num} title={project.title} />
            </div>
          </div>

          {/* Back (IaC Code) */}
          <div 
            className="absolute inset-0 backface-hidden rounded-2xl md:rounded-3xl border border-[#58a6ff]/30 bg-[#0d1117] shadow-[0_0_40px_rgba(88,166,255,0.15)] overflow-hidden flex flex-col" 
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="h-10 bg-[#161b22] border-b border-white/5 flex items-center px-4 relative">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#8b949e] text-xs font-bold tracking-widest font-mono">
                infrastructure.yml
              </div>
            </div>
            <div className="p-4 md:p-6 overflow-auto bg-[#0d1117] h-full">
              <div className="text-[10px] md:text-xs font-mono leading-relaxed whitespace-pre">
                <div className="text-[#c9d1d9] font-mono">
                  {project.iacCode.split('\n').map((line, i) => (
                    <div key={i} className="table-row">
                      <span className="table-cell pr-4 text-[#8b949e] select-none text-right opacity-50">{i + 1}</span>
                      <span 
                        className="table-cell whitespace-pre"
                        dangerouslySetInnerHTML={{
                          __html: line
                            .replace(/([a-zA-Z0-9_-]+):/g, '<span style="color:#7ee787">$1</span>:')
                            .replace(/(".*?")/g, '<span style="color:#a5d6ff">$1</span>')
                            .replace(/(#.*)/g, '<span style="color:#8b949e">$1</span>')
                            .replace(/(true|false)/g, '<span style="color:#79c0ff">$1</span>')
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
