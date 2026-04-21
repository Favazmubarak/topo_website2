"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: false,
        mirror: false,
        offset: 50,
      });
    };

    // Listen for custom event from LoadingScreen
    window.addEventListener("loaderFinished", initAOS);

    return () => {
      window.removeEventListener("loaderFinished", initAOS);
    };
  }, []);

  return <>{children}</>;
};
