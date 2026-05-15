"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";

const AOS_CONFIG = {
  duration: 800,
  easing: "ease-in-out",
  once: false,
  mirror: false,
  offset: 50,
} as const;

export const AOSProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (isHomePage) {
      // On home page: wait for the loader to finish before initialising AOS
      // so elements aren't revealed before the curtain lifts.
      const initAOS = () => AOS.init(AOS_CONFIG);
      window.addEventListener("loaderFinished", initAOS);
      return () => window.removeEventListener("loaderFinished", initAOS);
    } else {
      // On all other pages (gallery, products, …): initialise immediately.
      // Without this, data-aos elements stay invisible forever because
      // loaderFinished is never dispatched on non-home pages.
      AOS.init(AOS_CONFIG);
    }
  }, [isHomePage]);

  return <>{children}</>;
};
