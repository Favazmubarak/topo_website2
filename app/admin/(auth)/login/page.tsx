"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/admin/(dashboard)/hooks/useAuthStore";
import { toast } from "react-hot-toast";
import { FaSpinner, FaExclamationCircle } from "react-icons/fa";

// ─── Inline field error ───────────────────────────────────────────────────────
const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="flex items-center gap-1 text-[10px] text-red-500 font-semibold mt-1 ml-1 animate-in fade-in duration-200">
      <FaExclamationCircle size={8} />
      {msg}
    </p>
  ) : null;

// ─── Client-side validation ───────────────────────────────────────────────────
const validate = (email: string, password: string) => {
  const errs: Record<string, string> = {};
  if (!email.trim()) {
    errs.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errs.email = "Invalid email format";
  }
  if (!password) {
    errs.password = "Password is required";
  } else if (password.length < 6) {
    errs.password = "Password must be at least 6 characters";
  }
  return errs;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const errors = { ...localErrors, ...serverErrors };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerErrors({});

    // Client-side check first
    const clientErrs = validate(email, password);
    if (Object.keys(clientErrs).length > 0) {
      setLocalErrors(clientErrs);
      return;
    }
    setLocalErrors({});

    try {
      await login({ email, password });
      toast.success("Welcome back!");
      router.push("/admin");
    } catch (error: any) {
      const serverFieldErrors = error?.response?.data?.errors;
      if (serverFieldErrors && typeof serverFieldErrors === "object") {
        setServerErrors(serverFieldErrors);
      } else {
        const msg = error?.response?.data?.message || error?.message || "Invalid credentials";
        toast.error(msg);
      }
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

        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/70 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (localErrors.email) setLocalErrors(p => { const { email, ...r } = p; return r; });
                  if (serverErrors.email) setServerErrors(p => { const { email, ...r } = p; return r; });
                }}
                placeholder="admin@topo.com"
                className={`w-full bg-gray-50 border text-black px-4 py-4 rounded-lg focus:outline-none focus:ring-1 transition-all text-sm placeholder:text-gray-400
                  ${errors.email
                    ? "border-red-300 ring-1 ring-red-300 bg-red-50"
                    : "border-gray-200 focus:ring-black/20 focus:border-black/30"
                  }`}
              />
              <FieldError msg={errors.email} />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/70 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (localErrors.password) setLocalErrors(p => { const { password, ...r } = p; return r; });
                  if (serverErrors.password) setServerErrors(p => { const { password, ...r } = p; return r; });
                }}
                placeholder="••••••••"
                className={`w-full bg-gray-50 border text-black px-4 py-4 rounded-lg focus:outline-none focus:ring-1 transition-all text-sm placeholder:text-gray-400
                  ${errors.password
                    ? "border-red-300 ring-1 ring-red-300 bg-red-50"
                    : "border-gray-200 focus:ring-black/20 focus:border-black/30"
                  }`}
              />
              <FieldError msg={errors.password} />
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
