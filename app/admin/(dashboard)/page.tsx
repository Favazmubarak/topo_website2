"use client";

import React from "react";
import Link from "next/link";
import { 
  FaBoxes, 
  FaQuoteLeft, 
  FaImage, 
  FaPlus, 
  FaArrowRight 
} from "react-icons/fa";

const stats = [
  { name: "Total Products", value: "12", icon: FaBoxes, color: "bg-blue-50 text-blue-600" },
  { name: "Client Reviews", value: "24", icon: FaQuoteLeft, color: "bg-purple-50 text-purple-600" },
  { name: "Gallery Images", value: "48", icon: FaImage, color: "bg-amber-50 text-amber-600" },
];

const quickActions = [
  { name: "Add New Product", href: "/admin/products", icon: FaPlus },
  { name: "Manage Testimonials", href: "/admin/testimonials", icon: FaQuoteLeft },
  { name: "Update Hero CMS", href: "/admin/hero", icon: FaArrowRight },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard</h1>
        <p className="text-gray-500 mt-2 font-medium text-sm">Welcome back. Here's what's happening with your site.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-6`}>
              <stat.icon size={20} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.name}</p>
            <p className="text-4xl font-bold text-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
          <h2 className="text-lg font-bold text-black mb-6">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-black/10 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                    <action.icon size={16} />
                  </div>
                  <span className="text-sm font-bold text-black">{action.name}</span>
                </div>
                <FaArrowRight size={12} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-black text-white p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">System Status</h2>
            <p className="text-gray-400 text-sm font-medium">All systems are running smoothly.</p>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Live & Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
