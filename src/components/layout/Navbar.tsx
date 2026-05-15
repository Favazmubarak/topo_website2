"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about", isScroll: true },
  { name: "Products", href: "/products" },
  { name: "Gallery", href: "/gallery" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  
  // Use the scrolled state to determine if it should look like a notch
  const isNotch = isScrolled;
  const isWhiteHeader = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      setIsVisible(true);
      lastScrollY.current = currentScrollY;
    };

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (isHomePage) {
      const sections = ["about", "hero"];
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [isHomePage]);

  useEffect(() => {
    if (isHomePage && typeof window !== "undefined") {
      const scrollTarget = sessionStorage.getItem("scrollTarget");
      if (scrollTarget || window.location.hash) {
        window.scrollTo(0, 0);
        const targetId = scrollTarget || window.location.hash.replace("#", "");
        let attempts = 0;
        const intervalId = setInterval(() => {
          attempts++;
          const currentTarget = sessionStorage.getItem("scrollTarget") || window.location.hash.replace("#", "");
          if (currentTarget) {
            const element = document.getElementById(currentTarget);
            if (element) {
              setTimeout(() => {
                element.scrollIntoView({ behavior: "smooth" });
                sessionStorage.removeItem("scrollTarget");
              }, 100);
              clearInterval(intervalId);
            }
          }
          if (attempts > 20) {
            clearInterval(intervalId);
            sessionStorage.removeItem("scrollTarget");
          }
        }, 100);
        return () => clearInterval(intervalId);
      }

      const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash) {
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      };
      
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, [isHomePage, pathname]);

  const handleScrollNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setIsMobileMenuOpen(false);
    if (isHomePage) {
      e.preventDefault();
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      sessionStorage.setItem("scrollTarget", id);
    }
  };

  useEffect(() => {
    setIsScrolled(false);
    setIsVisible(true);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] pointer-events-none transition-all duration-500 pt-0 md:pt-3 ${
          isVisible || isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div
          className={`relative mx-auto flex items-center justify-between pointer-events-auto transition-all duration-500 ease-in-out ${
            isNotch
              ? "h-[52px] max-w-[680px] bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 px-5 md:px-6 mt-3 md:mt-0 w-[calc(100%-1.5rem)] md:w-full"
              : "h-[88px] max-w-[1400px] bg-transparent rounded-none px-5 sm:px-8 md:px-16 mt-0 w-full border border-transparent shadow-none"
          }`}
        >
          {/* Logo Section */}
          <Link
            href="/"
            onClick={(e) => {
              if (isHomePage) {
                handleScrollNav(e, "hero");
              } else {
                sessionStorage.setItem("scrollTarget", "hero");
                router.push("/");
              }
            }}
            className="flex items-center gap-2 group"
          >
            <div
              className={`relative transition-all duration-500 ${
                isNotch
                  ? "h-6 md:h-[36px] w-20 md:w-[110px]"
                  : "h-10 md:h-[68px] w-28 md:w-[190px]"
              }`}
            >
              <Image
                src="/logo.webp"
                alt="topo logo white"
                fill
                className={`object-contain transition-all duration-500 ${
                  isWhiteHeader ? "opacity-100" : "opacity-0"
                }`}
                priority
              />
              <Image
                src="/logo-blue.webp"
                alt="topo logo blue"
                fill
                className={`object-contain transition-all duration-500 ${
                  isWhiteHeader ? "opacity-0" : "opacity-100"
                }`}
                priority
              />
            </div>
          </Link>

          {/* Desktop Links - Absolutely Centered */}
          <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isScrollLink = link.isScroll || link.name === "Home";
              const targetId = link.name === "Home" ? "hero" : link.href.replace("#", "");
              const isActive = isScrollLink
                ? isHomePage && activeSection === (link.href === "/" ? "hero" : targetId)
                : pathname === link.href && (!isHomePage || activeSection === "hero" || activeSection === "");

              return (
                <Link
                  key={link.name}
                  href={isScrollLink ? "/" : link.href}
                  scroll={false}
                  onClick={(e) => {
                    if (isScrollLink) handleScrollNav(e, targetId);
                  }}
                  className={`text-[13.5px] tracking-tight transition-all duration-500 font-bold ${
                    isWhiteHeader
                      ? "text-white hover:text-white/80"
                      : isActive
                      ? "text-[#0066B2]"
                      : "text-black hover:text-[#0066B2]"
                  }`}
                  style={isWhiteHeader ? { textShadow: "0 1px 4px rgba(0,0,0,0.3)" } : {}}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Spacer for Layout Balancing */}
          <div className="w-8 hidden md:block" />

          {/* Mobile Toggle */}
          <button
            className={`md:hidden p-2 transition-colors duration-300 pointer-events-auto ${
              isWhiteHeader ? "text-white" : "text-black"
            }`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span className="h-0.5 w-6 bg-current rounded-full" />
              <span className="h-0.5 w-4 bg-current rounded-full" />
              <span className="h-0.5 w-6 bg-current rounded-full" />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Overlay */}
      <div
        className={`fixed inset-0 z-[110] bg-white/95 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col px-8 py-12 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex justify-between items-center mb-20">
          <div className="relative w-24 h-10">
             <Image src="/logo-blue.webp" alt="Logo" fill className="object-contain" />
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="p-3 bg-gray-50 rounded-full text-[#0066B2]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-8">
          {navLinks.map((link) => {
            const isScrollLink = link.isScroll || link.name === "Home";
            const targetId = link.name === "Home" ? "hero" : link.href.replace("#", "");

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (isScrollLink) {
                    handleScrollNav(e, targetId);
                  }
                }}
                className="text-4xl font-medium text-black/80 hover:text-[#0066B2] transition-colors"
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-12 border-t border-black/5">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30 mb-4">Contact</p>
          <p className="text-xl font-bold text-[#0066B2]">info@topowindows.com</p>
        </div>
      </div>
    </>
  );
}
