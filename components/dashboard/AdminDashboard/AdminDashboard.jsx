"use client";
import React, { useState } from "react";
import {
  Users,
  Briefcase,
  FileText,
  Calendar,
  CreditCard,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Building2,
} from "lucide-react";
import EmployeeMasterTab from "./EmployeeMasterTab";
import TeamManagementTab from "./TeamManagementTab";
import DocumentsTab from "./DocumentsTab";
import AttendanceTab from "./AttendanceTab";
import PaymentsTab from "./PaymentsTab";
import ReportsTab from "./ReportsTab";
import OverviewTab from "./OverviewTab";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/emblem-of-india.png";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

  const handleLogout = () => {
    clearUser();
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "employees", label: "Employee Master", icon: Users },
    { id: "teams", label: "Team Management", icon: Briefcase },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "reports", label: "MIS Reports", icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "employees":
        return <EmployeeMasterTab />;
      case "teams":
        return <TeamManagementTab />;
      case "documents":
        return <DocumentsTab />;
      case "attendance":
        return <AttendanceTab />;
      case "payments":
        return <PaymentsTab />;
      case "reports":
        return <ReportsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-blue-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Image src={logo} alt="Logo" width={24} height={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">EDAMS</h1>
              <p className="text-xs text-blue-200">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {navItems.find((i) => i.id === activeTab)?.label}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <p className="text-sm font-medium text-orange-800">
                Election Duty 2025
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
