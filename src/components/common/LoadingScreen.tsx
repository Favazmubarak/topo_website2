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
    }, 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-all duration-700 ease-out ${isFading
          ? "opacity-0 scale-[1.03] pointer-events-none"
          : "opacity-100 scale-100"
        }`}
    >
      {/* Fixed Container */}
      <div className="relative flex items-center justify-center w-[190px] h-[190px] min-w-[190px] min-h-[190px] max-w-[190px] max-h-[190px] overflow-hidden">

        {/* Logo */}
        <div
          className={`relative z-10 flex items-center justify-center w-[130px] h-[130px] min-w-[130px] min-h-[130px] max-w-[130px] max-h-[130px] transition-all duration-500 ease-out ${isFading
              ? "opacity-0 scale-90"
              : "opacity-100 scale-100"
            }`}
        >
          <Image
            src="/logo-blue.png"
            alt="Logo"
            width={130}
            height={130}
            priority
            className="object-contain select-none pointer-events-none"
          />
        </div>

        {/* Rotating Circle */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative w-[130px] h-[130px] animate-smooth-rotate">

            {/* Background Ring */}
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
                className="text-gray-200 opacity-30"
              />
            </svg>

            {/* Main Ring */}
            <svg
              className="absolute inset-0 w-full h-full"
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
                strokeDashoffset={fixedOffset}
                strokeLinecap="round"
                className="text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]"
              />
            </svg>

            {/* Reverse Ring */}
            <div className="absolute inset-0 rounded-full animate-smooth-rotate-reverse opacity-40">
              <div className="w-full h-full rounded-full border-[2px] border-transparent border-t-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;