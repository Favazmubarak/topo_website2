"use client";

import AdminSidebar from "@/src/components/admin/AdminSidebar";
import ProtectedRoute from "@/src/components/admin/ProtectedRoute";
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

        <main className="flex-1 lg:ml-64 p-4 pt-20 md:p-8 lg:p-12 md:pt-24 lg:pt-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
