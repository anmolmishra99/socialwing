"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import Dashboard from "@/components/dashboard/dashboard";
import LoadingScreen from "@/components/dashboard/Shared/LoadingScreen";

export default function DashboardPage() {
  const { user } = UserAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && user === null) {
      router.push("/login");
    }
  }, [user, router, isClient]);

  // Show loading screen while auth state resolves
  if (!isClient || user === undefined) {
    return <LoadingScreen />;
  }

  // Handle case where user is null but we are still transitioning routes
  if (user === null) {
    return <LoadingScreen />;
  }

  return <Dashboard />;
}
