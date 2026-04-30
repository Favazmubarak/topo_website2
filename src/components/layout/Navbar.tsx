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
  const isWhiteHeader = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
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
      const handleHashScroll = () => {
        const hash = window.location.hash;
        if (!hash) return false;

        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 100);
          return true;
        }
        return false;
      };

      const scrollTarget = sessionStorage.getItem("scrollTarget");
      if (scrollTarget || window.location.hash) {
        window.scrollTo(0, 0);

        const targetId = scrollTarget || window.location.hash.replace("#", "");

        let attempts = 0;
        const intervalId = setInterval(() => {
          attempts++;
          const hash = window.location.hash;
          const currentTarget = sessionStorage.getItem("scrollTarget") || (hash ? hash.replace("#", "") : null);
          
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
        className={`fixed top-0 left-0 w-full z-[100] flex items-center px-3 sm:px-6 md:px-12 lg:px-20 py-2 md:py-2.5 transition-all duration-500 bg-white/10 backdrop-blur-[1px] shadow-lg border-b border-white/20 ${
          isVisible || isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex-1 flex items-center z-50">
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
            className="relative block w-[90px] sm:w-[110px] md:w-[130px] h-8 sm:h-10 md:h-14"
          >
            <Image
              src="/logo.webp"
              alt="topo logo white"
              fill
              className={`object-contain transition-opacity duration-500 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] ${isWhiteHeader ? "opacity-100" : "opacity-0"
                }`}
              priority
            />
            <Image
              src="/logo-blue.webp"
              alt="topo logo blue"
              fill
              className={`object-contain scale-[1.12] transition-opacity duration-500 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] ${isWhiteHeader ? "opacity-0" : "opacity-100"
                }`}
              priority
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 flex-none">
          {navLinks.map((link) => {
            const isScrollLink = link.isScroll || link.name === "Home";
            const targetId = link.name === "Home" ? "hero" : link.href.replace("#", "");
            const isActive = isScrollLink
              ? isHomePage && activeSection === (link.href === "/" ? "hero" : targetId)
              : pathname === link.href && (!isHomePage || activeSection === "hero" || activeSection === "");

            const linkHref = isScrollLink ? "/" : link.href;

            return (
              <Link
                key={link.name}
                href={linkHref}
                scroll={false}
                onClick={(e) => {
                  if (isScrollLink) {
                    handleScrollNav(e, targetId);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`group text-base transition-all duration-500 flex flex-col items-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${
                  isWhiteHeader
                    ? "text-white hover:text-white"
                    : isActive
                      ? "text-brand-blue"
                      : "text-black hover:text-brand-blue"
                }`}
              >
                <span className="flex flex-col items-center">
                  <span className={`transition-all duration-500 ${
                    isActive 
                      ? `font-bold opacity-100 ${isWhiteHeader ? "text-white" : "text-brand-blue"}` 
                      : "font-light opacity-80 group-hover:font-bold group-hover:opacity-100"
                  }`}>
                    {link.name}
                  </span>
                  <span className="font-bold invisible h-0 select-none pointer-events-none" aria-hidden="true">
                    {link.name}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex-1 flex justify-end">
          <button
            className="md:hidden z-50 p-2 focus:outline-none text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-8 h-6 flex flex-col justify-between items-end relative">
              <span
                className={`h-0.5 transition-all duration-500 rounded-full bg-black ${isMobileMenuOpen ? "w-8 rotate-45 translate-y-2.5" : "w-8"}`}
              />
              <span
                className={`h-0.5 transition-all duration-500 rounded-full bg-black ${isMobileMenuOpen ? "opacity-0 -translate-x-2" : "w-6 opacity-100"}`}
              />
              <span
                className={`h-0.5 transition-all duration-500 rounded-full bg-black ${isMobileMenuOpen ? "w-8 -rotate-45 -translate-y-2.5" : "w-8"}`}
              />
            </div>
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-[56px] left-0 w-full bg-white/10 backdrop-blur-sm z-[40] flex flex-col items-center justify-center p-8 transition-all duration-500 ease-in-out md:hidden shadow-lg border-b border-white/20 ${isMobileMenuOpen 
          ? "translate-y-0 opacity-100 visible" 
          : "-translate-y-full opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center space-y-3 w-full">
          {navLinks.map((link) => {
            const isScrollLink = link.isScroll || link.name === "Home";
            const targetId = link.name === "Home" ? "hero" : link.href.replace("#", "");
            const isActive = isScrollLink
              ? isHomePage && activeSection === (link.href === "/" ? "hero" : targetId)
              : pathname === link.href && (!isHomePage || activeSection === "hero" || activeSection === "");

            const linkHref = isScrollLink ? "/" : link.href;

            return (
              <div key={link.name} className="overflow-hidden w-full text-center">
                <Link
                  href={linkHref}
                  scroll={false}
                  onClick={(e) => {
                    if (isScrollLink) {
                      handleScrollNav(e, targetId);
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`
  block w-full py-2 px-3 rounded-lg
  text-xl relative
  transition-all duration-200

  ${isActive
                      ? "bg-white/20 backdrop-blur-md border border-white/30 text-brand-blue font-semibold shadow-sm"
                      : "text-black/70 font-medium"
                    }

  active:scale-[0.97]
`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>{link.name}</span>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
