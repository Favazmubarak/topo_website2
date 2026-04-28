"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { 
  FaBoxes, 
  FaQuoteLeft, 
  FaImage, 
  FaPlus, 
  FaArrowRight 
} from "react-icons/fa";
import { useProductAdminStore } from "./(features)/products/hooks/useProductAdmin";
import { useTestimonialAdminStore } from "./(features)/testimonials/hooks/useTestimonialAdmin";
import { useGalleryAdminStore } from "./(features)/gallery/hooks/useGalleryAdmin";

const quickActions = [
  { name: "Add New Product", href: "/admin/products", icon: FaPlus },
  { name: "Manage Testimonials", href: "/admin/testimonials", icon: FaQuoteLeft },
  { name: "Update Hero CMS", href: "/admin/hero", icon: FaArrowRight },
];

function StatSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 md:p-8 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm animate-pulse">
      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg md:rounded-xl mb-3 md:mb-6" />
      <div className="h-2 bg-gray-100 rounded w-2/3 mb-3" />
      <div className="h-8 bg-gray-100 rounded w-1/2" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const { products, fetchProducts, loading: loadingProducts } = useProductAdminStore();
  const { testimonials, fetchTestimonials, loading: loadingTestimonials } = useTestimonialAdminStore();
  const { images, fetchImages, loading: loadingGallery } = useGalleryAdminStore();

  useEffect(() => {
    fetchProducts();
    fetchTestimonials();
    fetchImages();
  }, [fetchProducts, fetchTestimonials, fetchImages]);

  const isLoading = loadingProducts || loadingTestimonials || loadingGallery;

  const stats = [
    { name: "Total Products", value: products.length, icon: FaBoxes, color: "bg-blue-50 text-blue-600" },
    { name: "Client Reviews", value: testimonials.length, icon: FaQuoteLeft, color: "bg-purple-50 text-purple-600" },
    { name: "Gallery Images", value: images.length, icon: FaImage, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6 md:space-y-10 lg:space-y-12">
      {/* Heading */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-black">Dashboard</h1>
        <p className="text-gray-500 mt-1 font-medium text-xs sm:text-sm">Welcome back. Here's what's happening with your site.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {isLoading && products.length === 0 && testimonials.length === 0 && images.length === 0
          ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((stat) => (
            <div key={stat.name} className="bg-white p-4 sm:p-5 md:p-8 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${stat.color} rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-6`}>
                <stat.icon size={14} className="sm:hidden" />
                <stat.icon size={18} className="hidden sm:block md:hidden" />
                <stat.icon size={20} className="hidden md:block" />
              </div>
              <p className="text-[8px] sm:text-[9px] md:text-sm font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.name}</p>
              <p className="text-xl sm:text-2xl md:text-4xl font-bold text-black mt-1">{stat.value}</p>
            </div>
          ))
        }
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {/* Quick Actions */}
        <div className="bg-gray-50/50 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-100">
          <h2 className="text-sm md:text-lg font-bold text-black mb-3 md:mb-6">Quick Actions</h2>
          <div className="space-y-2 md:space-y-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center justify-between p-3 md:p-4 bg-white rounded-lg md:rounded-xl border border-gray-100 hover:border-black/10 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                    <action.icon size={13} className="md:hidden" />
                    <action.icon size={16} className="hidden md:block" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-black">{action.name}</span>
                </div>
                <FaArrowRight size={10} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-black text-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl flex flex-col justify-between min-h-[140px] md:min-h-0">
          <div>
            <h2 className="text-sm md:text-xl font-bold mb-1 md:mb-2">System Status</h2>
            <p className="text-gray-400 text-xs md:text-sm font-medium">All systems are running smoothly.</p>
          </div>
          <div className="mt-6 md:mt-8 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400">Live &amp; Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
