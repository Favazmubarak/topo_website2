"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";

const LoadingScreen = () => {
  const [isFading, setIsFading] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const fixedOffset = circumference * (1 - 0.35);

  useEffect(() => {
    // Prevent layout repaint flicker
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      setIsFading(true);

      window.dispatchEvent(new Event("loaderFinished"));

      setTimeout(() => {
        AOS.refresh();
      }, 50);
    }, 1100);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = "";
    }, 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700 ease-linear ${isFading ? "opacity-0" : "opacity-100"
        }`}
      style={{
        willChange: "opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="relative w-[190px] h-[190px] flex items-center justify-center">

        {/* LOGO */}
        <div
          className={`absolute z-10 transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"
            }`}
          style={{
            width: 130,
            height: 130,
            minWidth: 130,
            minHeight: 130,
            maxWidth: 130,
            maxHeight: 130,
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            contain: "layout style paint",
          }}
        >
          <img
            src="/logo-blue.png"
            alt="Logo"
            draggable={false}
            width={130}
            height={130}
            className="w-[130px] h-[130px] object-contain select-none pointer-events-none"
            style={{
              imageRendering: "auto",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              contain: "layout style paint",
            }}
          />
        </div>

        {/* ROTATING RINGS */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
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
                className="text-slate-300"
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