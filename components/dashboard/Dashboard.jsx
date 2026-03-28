"use client";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import OfficerDashboard from "./OfficerDashboard/OfficerDashboard";
import FieldOfficerDashboard from "./FieldOfficerDashboard/FieldOfficerDashboard";
import LoadingDashboardShimmer from "../ui/LoadingDashboardShimmer";

const Dashboard = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);

  if (!isHydrated) return <LoadingDashboardShimmer />;

  return (
    <div>
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "officer" && <OfficerDashboard />}
      {user?.role === "field_officer" && <FieldOfficerDashboard />}
    </div>
  );
};

export default Dashboard;
