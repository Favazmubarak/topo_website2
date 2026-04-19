"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about", isScroll: true },
  { name: "Products", href: "/products" },
  { name: "Gallery", href: "/gallery" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsMobileMenuOpen(false);
    if (isHomePage) {
      e.preventDefault();
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-24 py-10 transition-all duration-300 bg-transparent ${isScrolled ? "py-7" : ""
        }`}
    >
      {/* Logo */}
      <div className="flex items-center z-50">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="topo logo"
            width={160}
            height={64}
            className="w-auto h-20 md:h-20 object-contain transition-all duration-300 brightness-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
            priority
          />
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.isScroll ? (isHomePage ? "#about" : "/#about") : link.href}
              onClick={link.isScroll ? handleAboutClick : undefined}
              className="group text-base transition-all duration-200 flex flex-col items-center text-black hover:text-brand-blue drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
            >
              <span className="flex flex-col items-center">
                <span className={`transition-all duration-200 ${isActive ? "font-bold opacity-100" : "font- opacity-80 group-hover:font-bold group-hover:opacity-100"
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

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden z-50 p-2 text-black focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <div className="w-8 h-6 flex flex-col justify-between items-end">
          <span className={`w-8 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
          <span className={`w-6 h-0.5 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-8 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-10 transition-transform duration-500 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.isScroll ? (isHomePage ? "#about" : "/#about") : link.href}
              onClick={link.isScroll ? handleAboutClick : () => setIsMobileMenuOpen(false)}
              className={`text-3xl transition-all duration-200 ${isActive ? "font-bold text-brand-blue" : "font-light text-black"
                } hover:text-brand-blue hover:font-bold`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Spacer to keep balance on desktop */}
      <div className="hidden md:block w-40 shrink-0" />
    </nav>
  );
}
