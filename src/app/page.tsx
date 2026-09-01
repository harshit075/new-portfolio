"use client";

import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Contact } from "@/components/Contact";
import { Navbar } from "@/components/Navbar";
import { LiveMetrics } from "@/components/LiveMetrics";
import { PipelineLoader } from "@/components/PipelineLoader";
import { CarGame } from "@/components/CarGame";
import { StatusPage } from "@/components/StatusPage";
import { Achievements } from "@/components/Achievements";
import { AudioManager } from "@/components/AudioManager";
import { CliMode } from "@/components/CliMode";
import { Cursor } from "@/components/Cursor";
import { ScrollHelper } from "@/components/ScrollHelper";

export default function Home() {
  const [isPipelineComplete, setIsPipelineComplete] = useState(false);
  const [isCliMode, setIsCliMode] = useState(false);

  // Listen for re-triggering of the pipeline loader from CLI or StatusPage
  useEffect(() => {
    const handleRetrigger = () => {
      setIsPipelineComplete(false);
    };
    window.addEventListener("retrigger-pipeline-loader", handleRetrigger);
    return () => window.removeEventListener("retrigger-pipeline-loader", handleRetrigger);
  }, []);

  return (
    <main className="flex flex-col min-h-screen selection:bg-[#58a6ff] selection:text-black font-sans bg-background relative overflow-x-hidden">
      <Cursor />
      <AudioManager />
      <ScrollHelper />
      <AnimatePresence>
        {!isPipelineComplete && (
          <PipelineLoader onComplete={() => setIsPipelineComplete(true)} />
        )}
        {isCliMode && (
          <CliMode onClose={() => setIsCliMode(false)} />
        )}
      </AnimatePresence>

      <Navbar onOpenCli={() => setIsCliMode(true)} />
      <div className="flex flex-col w-full pb-24 md:pb-0 transition-all duration-300">
        <ThemeToggle />
        <LiveMetrics />
        <Hero />
        <About />
        <Projects />
        <Achievements />
        <Skills />
        <Contact />
        <StatusPage />
        <CarGame />
        <Footer />
      </div>
    </main>
  );
}
