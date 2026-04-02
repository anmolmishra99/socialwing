"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import { useAccountsStore } from "@/store/accountsStore";
import DashboardHome from "./Home/DashboardHome";
import CreatePost from "./CreatePost/CreatePost";
import CalendarView from "./Calendar/CalendarView";
import MediaLibrary from "./MediaLibrary/MediaLibrary";
import AutoReply from "./AutoReply/AutoReply";
import AccountsPage from "./Accounts/AccountsPage";
import SettingsPage from "./Settings/SettingsPage";

const MAIN_NAV = [
  {
    name: "Dashboard",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: "Create Post",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        />
      </svg>
    ),
  },
  {
    name: "Calendar",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    name: "Media Library",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    name: "Auto Reply",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        />
        <path strokeLinecap="round" d="M9 10h6M9 13h3" />
      </svg>
    ),
  },
  {
    name: "Accounts",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-5.5 8.28"
        />
      </svg>
    ),
  },
];

const BOTTOM_NAV = [
  {
    name: "Settings",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

function NavButton({ item, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 14px",
        background: isActive ? "#5945FE" : "transparent",
        color: isActive ? "#ffffff" : "#555",
        border: isActive ? "2px solid #000" : "2px solid transparent",
        borderRadius: "6px",
        boxShadow: isActive ? "3px 3px 0 #000" : "none",
        cursor: "pointer",
        fontWeight: isActive ? 700 : 500,
        fontSize: "0.88rem",
        textAlign: "left",
        transition: "all 0.12s ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "#f5f5f5";
          e.currentTarget.style.color = "#000";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#555";
        }
      }}
    >
      {item.icon}
      {item.name}
    </button>
  );
}

export default function Dashboard({ initialTab = "Dashboard" }) {
  const { user, logOut } = UserAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { fetchAccounts } = useAccountsStore();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Centralized Account Fetching
  useEffect(() => {
    if (user?.uid) {
      fetchAccounts(user.uid);
    }
  }, [user?.uid, fetchAccounts]);

  // Sync tab with URL on mount or URL change
  useEffect(() => {
    if (pathname.includes("/compose")) {
      setActiveTab("Create Post");
    } else if (pathname.includes("/accounts")) {
      setActiveTab("Accounts");
    } else if (pathname === "/dashboard") {
      setActiveTab("Dashboard");
    }
  }, [pathname]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    
    // Update URL to match tab
    if (tabName === "Create Post") {
      router.push("/dashboard/compose");
    } else if (tabName === "Accounts") {
      router.push("/dashboard/accounts");
    } else if (tabName === "Dashboard") {
      router.push("/dashboard");
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardHome user={user} onNavigate={handleTabChange} />;
      case "Create Post":
        return <CreatePost />;
      case "Calendar":
        return <CalendarView />;
      case "Media Library":
        return <MediaLibrary />;
      case "Auto Reply":
        return <AutoReply />;
      case "Accounts":
        return <AccountsPage />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <DashboardHome user={user} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#fafafa",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar ── */}
      <div
        style={{
          width: "220px",
          flexShrink: 0,
          background: "#ffffff",
          borderRight: "2px solid #000",
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: "56px",
            borderBottom: "2px solid #000",
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              src="/assets/images/logo.png"
              alt="SocialWing Logo"
              style={{ height: "32px", width: "auto" }}
            />
            <span
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#000",
                letterSpacing: "-0.04em",
              }}
            >
              Social
              <em style={{ color: "#5945FE", fontStyle: "normal" }}>Wing</em>
            </span>
          </div>
        </div>

        {/* Main nav */}
        <nav
          style={{
            flex: 1,
            padding: "16px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          {/* <p
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#aaa",
              marginBottom: "6px",
              paddingLeft: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Menu
          </p> */}
          {MAIN_NAV.map((item) => (
            <NavButton
              key={item.name}
              item={item}
              isActive={activeTab === item.name}
              onClick={() => handleTabChange(item.name)}
            />
          ))}
        </nav>

        {/* Bottom nav: settings + user */}
        <div style={{ borderTop: "1px solid #eee", padding: "10px" }}>
          {BOTTOM_NAV.map((item) => (
            <NavButton
              key={item.name}
              item={item}
              isActive={activeTab === item.name}
              onClick={() => handleTabChange(item.name)}
            />
          ))}
        </div>

        {/* User section */}
        <div style={{ borderTop: "2px solid #000", padding: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                flexShrink: 0,
                background: "#E0E7FF",
                border: "2px solid #000",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.8rem",
                color: "#5945FE",
              }}
            >
              {user?.displayName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  color: "#000",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.displayName || "User"}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#999",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Free Plan
              </div>
            </div>
          </div>
          <button
            onClick={() => logOut()}
            style={{
              width: "100%",
              padding: "7px",
              background: "#fff",
              border: "1.5px solid #ddd",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.8rem",
              color: "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FF4D6D";
              e.currentTarget.style.color = "#FF4D6D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.color = "#888";
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign out
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top header */}
        <header
          style={{
            height: "56px",
            background: "#ffffff",
            borderBottom: "2px solid #000",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
          }}
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: "1.15rem",
              color: "#000",
              letterSpacing: "-0.02em",
            }}
          >
            {activeTab}
          </h1>
          {activeTab !== "Create Post" && (
            <button
              onClick={() => handleTabChange("Create Post")}
              style={{
                background: "#5945FE",
                color: "#fff",
                border: "2px solid #000",
                borderRadius: "6px",
                boxShadow: "2px 2px 0 #000",
                padding: "7px 16px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(1px, 1px)";
                e.currentTarget.style.boxShadow = "1px 1px 0 #000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "2px 2px 0 #000";
              }}
            >
              + New Post
            </button>
          )}
        </header>

        {/* Content area */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px",
            background: "#fafafa",
          }}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
