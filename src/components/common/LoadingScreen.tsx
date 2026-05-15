"use client";

import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import Image from "next/image";
import { usePathname } from "next/navigation";

const radius = 45;
const circumference = 2 * Math.PI * radius;

const LoadingScreen = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isFading, setIsFading] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const originalOverflow = useRef<string>("");

  useEffect(() => {
    // Only activate the loader on the home page
    if (!isHomePage) return;

    originalOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Stage 1: Scale logo up after a small delay
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 100);

    // Fallback: force heroReady after 12s max so the loader never hangs forever
    // (raised from 4s so slow connections don't dismiss before the image loads)
    const fallbackTimer = setTimeout(() => {
      setHeroReady(true);
    }, 12000);

    const heroReadyHandler = () => {
      setHeroReady(true);
    };

    window.addEventListener("heroReady", heroReadyHandler);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(fallbackTimer);
      window.removeEventListener("heroReady", heroReadyHandler);
      document.body.style.overflow = originalOverflow.current;
    };
  }, [isHomePage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stage 2: Progress animation (starts AFTER logo scaling animation is done)
  useEffect(() => {
    if (!logoVisible || !imageLoaded) return;

    // Wait for the 700ms logo scaling transition to finish
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const increment = prev < 70 ? 3 : 2; 
          return Math.min(prev + increment, 100);
        });
      }, 25);

      return () => clearInterval(interval);
    }, 800); // 700ms transition + 100ms buffer

    return () => clearTimeout(startTimer);
  }, [logoVisible, imageLoaded]);

  // Stage 3: Fade out when progress is 100 AND data is ready
  useEffect(() => {
    if (progress < 100 || !heroReady) return;

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      window.dispatchEvent(new Event("loaderFinished"));
    }, 0);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = originalOverflow.current;

      setTimeout(() => {
        AOS.refresh();
      }, 50);
    }, 400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [progress, heroReady]);

  if (!isHomePage || !shouldRender) return null;

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-white transition-opacity duration-400 ease-linear ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        willChange: "opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="relative w-[150px] h-[150px] flex items-center justify-center">
        {/* Logo Container */}
        <div
          className={`absolute z-10 transition-all duration-700 ease-out ${
            logoVisible && imageLoaded ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          style={{
            width: 100,
            height: 100,
            transformOrigin: "center",
            willChange: "transform, opacity",
          }}
        >
          <Image
            src="/logo-blue.webp"
            alt="Logo"
            width={100}
            height={100}
            priority
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-contain select-none pointer-events-none"
          />
        </div>

        {/* Circular Loader */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-[100px] h-[100px]">
            {/* Background Circle */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="1"
                fill="transparent"
                className="text-gray-200 opacity-20"
              />
            </svg>

            {/* Progress Circle (Only one loader) */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#0076d1"
                opacity={.8}
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-200 ease-out"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
