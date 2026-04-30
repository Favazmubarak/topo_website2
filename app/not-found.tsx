"use client";

import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function NotFound() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white px-6 overflow-hidden">
      <div className="max-w-[1400px] w-full flex flex-col items-center text-center relative">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
          <h1 className="font-highrise text-[20vw] md:text-[25vw] leading-none text-gray-50 opacity-[0.03] select-none uppercase">
            Not Found
          </h1>
        </div>

        {/* 404 Text */}
        <div data-aos="fade-down">
          <h2 className="font-highrise text-[clamp(120px,20vw,280px)] leading-none text-[#0066B2] tracking-tighter">
            404
          </h2>
        </div>

        {/* Message */}
        <div 
          className="mt-4 md:mt-0 flex flex-col items-center gap-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h1 className="font-montserrat text-2xl md:text-4xl lg:text-5xl font-medium text-black tracking-tight">
            Oops! Page not found
          </h1>
          
          <p className="font-poppins text-gray-500 text-base md:text-lg max-w-[500px] leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <Link
            href="/"
            className="group relative mt-4 px-10 py-4 bg-[#0066B2] text-white rounded-full font-poppins font-medium text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,102,178,0.3)] hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Return Home
            </span>
            <div className="absolute inset-0 bg-black/10 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
          </Link>
        </div>

        {/* Decorative Lines */}
        <div className="absolute top-0 left-0 w-24 h-[1px] bg-gray-100 hidden lg:block" />
        <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-gray-100 hidden lg:block" />
      </div>
    </main>
  );
}
