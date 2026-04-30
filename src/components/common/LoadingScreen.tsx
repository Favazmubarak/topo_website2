"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";
import Image from "next/image";

const LoadingScreen = () => {
  const [isFading, setIsFading] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const fixedOffset = circumference * (1 - 0.35);

  useEffect(() => {
    
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      window.dispatchEvent(new Event("loaderFinished"));
    }, 800);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = originalOverflow;

      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }, 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700 ease-linear ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        willChange: "opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="relative w-[150px] h-[150px] flex items-center justify-center">

        <div
          className={`absolute z-10 transition-opacity duration-500 ${
            isFading || !imageLoaded ? "opacity-100" : "opacity-100"
          }`}
          style={{
            width: 100,
            height: 100,
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            contain: "layout style paint",
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

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-[100px] h-[100px] animate-smooth-rotate">

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
                className="text-slate-300"
              />
            </svg>

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

