"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/admin/(dashboard)/hooks/useAuthStore";
import { toast } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success("Login successful");
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white font-montserrat px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 sm:mb-12 flex flex-col items-center">
          <div className="relative w-48 sm:w-64 md:w-80 h-16 sm:h-20 md:h-24 mb-4 md:mb-6">
            <Image
              src="/logo-blue.png"
              alt="Topo Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-400">Administration Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/70 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@topo.com"
                className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-black/30 transition-all text-sm placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/70 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-black/30 transition-all text-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-12 sm:mt-20 text-center border-t border-gray-100 pt-6 sm:pt-10">
          <p className="text-gray-400 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} Topo Aluminum Solutions
          </p>
        </div>
      </div>
    </div>
  );
}
