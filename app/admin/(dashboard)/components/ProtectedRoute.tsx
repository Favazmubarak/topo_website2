"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/admin/(dashboard)/hooks/useAuthStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    checkAuth();
    setHydrated(true);
  }, [checkAuth]);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
