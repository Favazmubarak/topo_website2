"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AOS from "aos";

const LoadingScreen = () => {
  const [isFading, setIsFading] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const radius = 45;
  const circumference = 2 * Math.PI * radius; 
  const fixedOffset = circumference * (1 - 0.35);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      window.dispatchEvent(new Event("loaderFinished"));
      setTimeout(() => {
        AOS.refresh();
      }, 50);
    }, 1100);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-all duration-500 ease-out ${isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"
        }`}
    >
      <div className="relative flex items-center justify-center h-48 w-48">

        <div className={`relative z-10 transition-all duration-400 ease-out ${isFading ? "scale-90 opacity-0" : "scale-100 opacity-100"
          }`}>
          <Image
            src="/logo-blue.png"
            alt="Logo"
            width={130}
            height={130}
            className="object-contain"
            priority
          />
        </div>

        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative h-32 w-32 animate-smooth-rotate">
            <svg
              className="absolute inset-0 h-full w-full transform"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="1"
                fill="transparent"
                className="text-gray-100 opacity-20"
              />
            </svg>

            <svg
              className="absolute inset-0 h-full w-full transform"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={circumference}
                style={{
                  strokeDashoffset: fixedOffset
                }}
                strokeLinecap="round"
                className="text-slate-300 filter drop-shadow-[0_0_12px_rgba(203,213,225,0.9)]"
              />
            </svg>

            <div className="absolute inset-0 rounded-full animate-smooth-rotate-reverse opacity-30">
              <div className="h-full w-full rounded-full border-[2.5px] border-transparent border-t-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
