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
    // Check if the loader has already been seen in this session
    const hasSeenLoader = typeof window !== "undefined" && sessionStorage.getItem("topo_loader_seen");

    if (isHomePage && !hasSeenLoader) {
      // On first home visit: wait for the cinematic loader to finish
      const initAOS = () => AOS.init(AOS_CONFIG);
      window.addEventListener("loaderFinished", initAOS);
      return () => window.removeEventListener("loaderFinished", initAOS);
    } else {
      // On sub-pages, OR on home page if loader was already seen (refresh/back):
      // Initialize immediately so content is visible.
      AOS.init(AOS_CONFIG);
    }
  }, [isHomePage, pathname]);

  return <>{children}</>;
};
