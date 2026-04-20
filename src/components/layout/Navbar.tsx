"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
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
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const isWhiteHeader = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-20 py-5 transition-all duration-300 bg-transparent"
    >
      <div className="flex items-center z-50">
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
        >
          <Image
            src={isWhiteHeader ? "/logo.png" : "/logo-blue.png"}
            alt="topo logo"
            width={160}
            height={64}
            className={`w-auto h-20 md:h-20 object-contain transition-all duration-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] ${isWhiteHeader
              ? "brightness-0 invert"
              : ""
              }`}
            priority
          />
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-6">
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
              }}              className={`group text-base transition-all duration-200 flex flex-col items-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${isWhiteHeader
                ? "text-white hover:text-white"
                : isActive
                  ? "text-brand-blue"
                  : "text-black hover:text-brand-blue"
                }`}
            >
              <span className="flex flex-col items-center">
                <span className={`transition-all duration-200 ${isActive ? "font-bold opacity-100 text-brand-blue" : "font-medium opacity-80 group-hover:font-bold group-hover:opacity-100"
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

      <button
        className={`md:hidden z-50 p-2 focus:outline-none ${isWhiteHeader && !isMobileMenuOpen ? "text-white" : "text-black"}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <div className="w-8 h-6 flex flex-col justify-between items-end relative">
          <span
            className={`h-0.5 transition-all duration-300 rounded-full ${isWhiteHeader && !isMobileMenuOpen ? "bg-white" : "bg-black"} ${isMobileMenuOpen ? "w-8 rotate-45 translate-y-2.5" : "w-8"}`}
          />
          <span
            className={`h-0.5 transition-all duration-300 rounded-full ${isWhiteHeader && !isMobileMenuOpen ? "bg-white" : "bg-black"} ${isMobileMenuOpen ? "opacity-0 -translate-x-2" : "w-6 opacity-100"}`}
          />
          <span
            className={`h-0.5 transition-all duration-300 rounded-full ${isWhiteHeader && !isMobileMenuOpen ? "bg-white" : "bg-black"} ${isMobileMenuOpen ? "w-8 -rotate-45 -translate-y-2.5" : "w-8"}`}
          />
        </div>
      </button>

      <div
        className={`fixed inset-0 bg-white/90 backdrop-blur-xl z-40 flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="flex flex-col items-center justify-center space-y-10">
          {navLinks.map((link) => {
            const isScrollLink = link.isScroll || link.name === "Home";
            const targetId = link.name === "Home" ? "hero" : link.href.replace("#", "");
            const isActive = isScrollLink
              ? isHomePage && activeSection === (link.href === "/" ? "hero" : targetId)
              : pathname === link.href && (!isHomePage || activeSection === "hero" || activeSection === "");

            const linkHref = isScrollLink ? "/" : link.href;

            return (
              <div key={link.name} className="overflow-hidden">
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
                  className={`text-4xl transition-all duration-300 relative group block text-center ${isActive ? "font-bold text-brand-blue" : "font-medium text-black/60"
                    } hover:text-brand-blue`}
                >
                  <span className="relative">
                    {link.name}
                    <span className={`absolute -bottom-2 left-0 w-0 h-1 bg-brand-blue rounded-full transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : ""}`} />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden md:block w-40 shrink-0" />
    </nav>
  );
}
