"use client";

import { Suspense } from "react";
import Dashboard from "@/components/dashboard/dashboard";
import LoadingScreen from "@/components/dashboard/Shared/LoadingScreen";

export default function ComposePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Dashboard initialTab="Create Post" />
    </Suspense>
  );
}
