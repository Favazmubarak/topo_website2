"use client";

import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const radius = 46;
const circumference = 2 * Math.PI * radius;

/**
 * Premium Architectural Circular Loader
 * Style: Topo Theme Blue & Precision Engineering
 */
const LoadingScreen = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [mounted, setMounted] = useState(false);
  const [hasSeen, setHasSeen] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const originalOverflow = useRef<string>("");

  useEffect(() => {
    // Session persistence for premium feel (one-time play)
    const seen = sessionStorage.getItem("topo_loader_seen");
    if (seen) {
      setHasSeen(true);
      setMounted(true);
      return;
    }

    if (!isHomePage) {
      setMounted(true);
      return;
    }

    setHasSeen(false);
    setMounted(true);

    originalOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fallbackTimer = setTimeout(() => setHeroReady(true), 12000);
    const heroReadyHandler = () => setHeroReady(true);
    window.addEventListener("heroReady", heroReadyHandler);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("heroReady", heroReadyHandler);
    };
  }, [isHomePage]);

  // Momentum-based progress
  useEffect(() => {
    if (hasSeen || !isHomePage) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 70 ? 2.5 : prev < 90 ? 0.6 : 0.2;
        return Math.min(prev + increment, 100);
      });
    }, 25);

    return () => clearInterval(interval);
  }, [hasSeen, isHomePage]);

  const handleExit = () => {
    sessionStorage.setItem("topo_loader_seen", "true");
    window.dispatchEvent(new Event("loaderFinished"));
    
    setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = originalOverflow.current;
      AOS.refresh();
    }, 1000);
  };

  useEffect(() => {
    if (progress === 100 && heroReady) {
      handleExit();
    }
  }, [progress, heroReady]);

  if (!mounted || hasSeen || !isHomePage || !shouldRender) return null;

  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const themeBlue = "#0066B2";

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FBFBFB] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      progress === 100 && heroReady ? "opacity-0 blur-2xl scale-110" : "opacity-100 scale-100"
    }`}>
      
      {/* BACKGROUND MATTE TEXTURE */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <div className="relative flex items-center justify-center w-[200px] h-[200px]">
        
        {/* LIGHT BLOOM (Studio Lighting) */}
        <div className="absolute inset-0 bg-[#0066B2]/5 blur-[60px] rounded-full scale-150 animate-pulse" />

        {/* PRECISION RINGS */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Inner Static Guide */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E5E5E5"
            strokeWidth="0.5"
            fill="transparent"
            className="opacity-40"
          />
          
          {/* Outer Dashed Accuracy Ring (Rotating) */}
          <circle
            cx="50"
            cy="50"
            r={radius + 4}
            stroke={themeBlue}
            strokeWidth="0.3"
            strokeDasharray="1 8"
            fill="transparent"
            className="opacity-20 animate-[spin_10s_linear_infinite]"
          />

          {/* Main Progress Arc */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={themeBlue}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 4px ${themeBlue}44)` }}
          />
        </svg>

        {/* BRAND CENTER */}
        <div className={`relative z-10 transition-all duration-1000 ease-out ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <div className="w-[110px] h-[110px] p-2 rounded-full bg-white/60 backdrop-blur-md border border-white/30 shadow-md flex items-center justify-center overflow-hidden">
            <Image
              src="/logo-blue.webp"
              alt="Logo"
              width={100}
              height={100}
              priority
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* TECHNICAL STATUS */}
      <div className="mt-12 flex flex-col items-center">
        <div className="h-[1px] w-12 bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-[#0066B2]/40 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="mt-4 text-[9px] font-montserrat uppercase tracking-[0.5em] text-gray-400">
          Precision Engineering
        </span>
      </div>

    </div>
  );
};

export default LoadingScreen;
