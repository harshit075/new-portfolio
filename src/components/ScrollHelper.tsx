"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SECTIONS = ["hero", "projects", "about", "achievements", "skills", "contact"];

export function ScrollHelper() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      let currentSectionIndex = 0;
      let minDistance = Infinity;

      SECTIONS.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          if (distance < minDistance) {
            minDistance = distance;
            currentSectionIndex = index;
          }
        }
      });

      if (e.key.toLowerCase() === "j") {
        e.preventDefault();
        const nextIndex = Math.min(currentSectionIndex + 1, SECTIONS.length - 1);
        const nextEl = document.getElementById(SECTIONS[nextIndex]);
        if (nextEl) {
          nextEl.scrollIntoView({ behavior: "smooth" });
        }
      } else if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        const prevIndex = Math.max(currentSectionIndex - 1, 0);
        const prevEl = document.getElementById(SECTIONS[prevIndex]);
        if (prevEl) {
          prevEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top Fixed Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-border/20 z-[999] pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-cyan-accent via-[#d2a8ff] to-[#3fb950] transition-all duration-75 shadow-[0_0_8px_rgba(0,255,255,0.5)]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 md:bottom-8 right-6 md:right-8 w-12 h-12 rounded-full border border-border bg-bg-secondary/60 backdrop-blur-xl flex items-center justify-center text-foreground hover:text-cyan-accent hover:border-cyan-accent shadow-xl hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300 active:scale-95 cursor-pointer z-40 group"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navigation Helper Indicator */}
      <div className="fixed bottom-6 left-6 z-40 hidden lg:block opacity-40 hover:opacity-100 transition-opacity duration-300 hh-mono text-[9px] text-text-muted border border-border/30 bg-bg-secondary/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
        Press <span className="text-foreground font-bold">J</span> next / <span className="text-foreground font-bold">K</span> prev
      </div>
    </>
  );
}
