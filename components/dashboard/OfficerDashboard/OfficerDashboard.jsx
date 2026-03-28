// src/components/saral/officer/OfficerDashboard.tsx
import React, { useState } from "react";
import { UserAuth } from "@/app/context/AuthContext";
// import { useSaral } from '@/contexts/SaralContext';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { Badge } from "@/components/ui/badge";
import {
  // FolderPlus,
  // Upload,
  // MapPin,
  // IndianRupee,
  // CheckCircle,
  // CheckCircle2,
  // Clock,
  FileText,
  // Users,
  // Eye,
  // Download,
  // Shield,
  Building2,
  // Landmark,
  Database,
  // Award,
  Banknote,
  Hash,
  // Workflow,
  // Plus,
  // Search,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
// import emblemOfIndia from '../../../assets/images/emblem-of-india.png';
import GovernmentLayout from "../GovernmentLayout";
// import ProjectManagement from './ProjectManagement';
// import VillageWiseReports from './VillageWiseReports';
// import KYCAssignmentManager from './KYCAssignmentManager';
// import PaymentInitiation from './PaymentInitiation';
// import NoticeGenerator from './NoticeGenerator';
// import SimpleFieldOfficerAssignment from './SimpleFieldOfficerAssignment';
// import EnhancedAwardManager from './EnhancedAwardManager';
// // import LandRecordsManager from './LandRecordsManager';
// import LandRecordsManager2 from './LandRecordsManage/LandRecordsManager2';
// import EnhancedPaymentManager from './EnhancedPaymentManager';
// import EnhancedDashboard from './EnhancedDashboard';
// import GlobalDashboard from './GlobalDashboard';
// import DocumentUploadPortal from './DocumentUploadPortal';
// import PaymentSlipGenerator from './PaymentSlipGenerator';
// import BlockchainDashboard from './BlockchainDashboard';
// import JMRManager from './JMRManager';
// import Dashboard2 from '../../dashboard/Dashboard2';
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OverviewSection from "./OverviewSection/OverviewSection";
import ProjectsSection from "./ProjectsSection/ProjectsSection";
import BlockChainSection from "./BlockChainSection/BlockChainSection";
import PaymentSlipSection from "./PaymentSlipSection/PaymentSlipSection";
import LandrecordsSection from "./LandrecordsSection/LandrecordsSection";
// import JmrSection from './JmrSection/JmrSection';
import DocumentsSection from "./DocumentsSection/DocumentsSection";
import NoticeSection from "./NoticeSection/NoticeSection";

const OfficerDashboard = () => {
  const { user, logOut, switchLanguage } = UserAuth();
  // const { getProjectStats, projects, landownerRecords } = useSaral();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const stats = getProjectStats();

  const handleLogout = () => {
    logOut();
    router.push("/login");
  };

  const handleLanguageChange = (language) => {
    switchLanguage(language);
  };

  // Navigation items for sidebar
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Overview and analytics",
    },
    // {
    //   id: 'overview',
    //   label: 'Overview',
    //   icon: FileText,
    //   description: 'System overview'
    // },
    {
      id: "projects",
      label: "Project Management",
      icon: Building2,
      description: "Manage land acquisition projects",
    },
    {
      id: "jmr",
      label: "Documents", // previously 'JMR Management'
      icon: FileText,
      description: "Joint Measurement Records",
    },
    {
      id: "landRecords2",
      label: "Land Records",
      icon: Database,
      description: "Land record management",
    },
    {
      id: "notices",
      label: "Notice Generator",
      icon: FileText,
      description: "Generate legal notices",
    },
    {
      id: "paymentSlips",
      label: "Payment Slips",
      icon: Banknote,
      description: "Payment slip generation",
    },
    {
      id: "blockchain",
      label: "Blockchain",
      icon: Hash,
      description: "Blockchain verification",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <OverviewSection />;
      //   case 'overview':
      //     return <div>Officer Dashboard</div>;
      case "projects":
        return <ProjectsSection />;
      case "landRecords2":
        return <LandrecordsSection />;
      case "jmr":
        return <DocumentsSection />;
      case "notices":
        return <NoticeSection />;
      case "paymentSlips":
        return <PaymentSlipSection />;
      case "blockchain":
        return <BlockChainSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <GovernmentLayout>
      <div className="flex h-screen font-mont bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - Enhanced Version */}
        <div
          className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 shadow-2xl border-r border-orange-500/30
          transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0
          transition-transform duration-300 ease-in-out flex flex-col h-screen
        `}
        >
          {/* Sidebar Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2
                className="text-xl font-bold text-white"
                style={{
                  //
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                }}
              >
                EDAMS
              </h2>
              <p
                className="text-sm text-blue-300 mt-1"
                style={{
                  //
                  fontWeight: 400,
                }}
              >
                Officer Dashboard
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-blue-800"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Items - Scrollable */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group",
                        isActive
                          ? "bg-orange-500 text-white shadow-lg"
                          : "text-blue-100 hover:bg-white/5"
                      )}
                      style={{
                        //
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 mr-3 flex-shrink-0",
                          isActive ? "text-white" : "text-blue-300"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{item.label}</div>
                      </div>
                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-white flex-shrink-0 ml-2" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Section - Fixed/Sticky */}
          <div className="mt-auto border-t border-white/10 bg-blue-950/80 backdrop-blur-sm">
            {/* Contact Info */}
            <div className="px-4 py-3 border-b border-white/5">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-200">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-xs">02528-220180</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-200">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-xs truncate">
                    desplandacquisition@gmail.com
                  </span>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="px-4 py-3 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-blue-200 flex-shrink-0" />
                <select
                  value={user?.language || "marathi"}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="flex-1 bg-transparent text-blue-200 border border-blue-400 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-400 cursor-pointer"
                >
                  <option value="marathi" className="bg-blue-900 text-white">
                    मराठी
                  </option>
                  <option value="english" className="bg-blue-900 text-white">
                    English
                  </option>
                  <option value="hindi" className="bg-blue-900 text-white">
                    हिंदी
                  </option>
                </select>
              </div>
            </div>

            {/* Logout Button */}
            <div className="px-4 py-3 border-b border-white/5">
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-white font-medium"
                style={{
                  //
                  fontWeight: 600,
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-bold">Logout</span>
              </button>
            </div>

            {/* Government Footer */}
            {/* <div className="px-4 py-3">
              <div className="text-center">
                <p className="text-xs text-blue-300" style={{ 
                 
                }}>Content Owned by District Administration</p>
                <p className="text-xs text-blue-400/60 mt-1">© District Palghar, Developed and hosted by NIC</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900" style={{}}>
                    {navigationItems.find((item) => item.id === activeTab)
                      ?.label || "Dashboard"}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {navigationItems.find((item) => item.id === activeTab)
                      ?.description || "Land Acquisition Management System"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-700"
                >
                  {new Date().toLocaleDateString("en-IN")}
                </Badge>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">{renderContent()}</div>
          </main>
        </div>
      </div>
    </GovernmentLayout>
  );
};

export default OfficerDashboard;
