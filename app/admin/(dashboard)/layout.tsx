"use client";

import AdminSidebar from "./components/AdminSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUIStore } from "@/app/admin/(dashboard)/hooks/useUIStore";
import { FaBars } from "react-icons/fa";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggleSidebar } = useUIStore();

  return (
    <ProtectedRoute>
      <div className="flex bg-white min-h-screen relative">
        {/* Mobile Top Bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-30">
          <h1 className="text-lg font-bold tracking-tight text-black">Topo <span className="font-light">Admin</span></h1>
          <button
            onClick={toggleSidebar}
            className="p-2 text-black hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FaBars size={20} />
          </button>
        </div>

        <AdminSidebar />

        <main className="flex-1 lg:ml-64 overflow-x-hidden px-4 sm:px-5 md:px-8 lg:px-12 pt-20 sm:pt-20 md:pt-20 lg:pt-12 pb-6 sm:pb-6 md:pb-10 lg:pb-12">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
