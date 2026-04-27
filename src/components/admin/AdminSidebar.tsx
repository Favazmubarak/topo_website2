"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaShoppingBag,
  FaQuoteLeft,
  FaImages,
  FaQuestionCircle,
  FaInfoCircle,
  FaBullhorn,
  FaCheckCircle,
  FaHome,
  FaSignOutAlt,
  FaTimes,
  FaStar,
  FaVideo,
} from "react-icons/fa";
import { useUIStore } from "@/app/admin/(dashboard)/hooks/useUIStore";
import { useAuthStore } from "@/app/admin/(dashboard)/hooks/useAuthStore";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: FaHome },
  { name: "Hero Section", href: "/admin/hero", icon: FaStar },
  { name: "Products", href: "/admin/products", icon: FaShoppingBag },
  { name: "Testimonials", href: "/admin/testimonials", icon: FaQuoteLeft },
  { name: "About Us", href: "/admin/about", icon: FaInfoCircle },
  { name: "CTA Section", href: "/admin/cta", icon: FaBullhorn },
  { name: "Gallery", href: "/admin/gallery", icon: FaImages },
  { name: "FAQ", href: "/admin/faq", icon: FaQuestionCircle },
  { name: "Why Choose Us", href: "/admin/why-choose", icon: FaCheckCircle },
  { name: "Reels", href: "/admin/reels", icon: FaVideo },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-64 h-screen bg-gray-200 border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="relative w-48 h-14">
            <Image
              src="/logo-blue.png"
              alt="Topo Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 text-gray-400 hover:text-black lg:hidden"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => closeSidebar()}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${isActive
                  ? "bg-black text-white font-bold shadow-md transform scale-[1.02]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-black font-medium"
                  }`}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button
            onClick={logout}
            className="flex items-center gap-4 w-full px-6 py-4 text-gray-400 hover:text-black hover:bg-gray-100 transition-all rounded-xl mt-auto border-t border-gray-50"
          >
            <FaSignOutAlt size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
