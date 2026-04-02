"use client";

import { useState, useEffect } from "react";
import { UserAuth } from "@/app/context/AuthContext";
import { useAccountsStore } from "@/store/accountsStore";
import toast from "react-hot-toast";

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    color: "#E4405F",
    description: "Photos, stories, reels",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs>
          <linearGradient id="ig-acc" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-acc)" />
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "X / Twitter",
    color: "#000000",
    description: "Tweets, threads, spaces",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <rect width="24" height="24" rx="6" fill="#000" />
        <path
          d="M16.6 5h2.2l-4.8 5.5L19.6 19h-4.4l-3.5-4.6L7.6 19H5.4l5.2-5.9L5 5h4.5l3.2 4.2L16.6 5zm-.8 12.6h1.2L8.8 6.2H7.5l8.3 11.4z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    description: "Videos, shorts, community",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <rect width="24" height="24" rx="6" fill="#FF0000" />
        <polygon points="10,8 16,12 10,16" fill="#fff" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#000000",
    description: "Short-form video content",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <rect width="24" height="24" rx="6" fill="#000" />
        <path
          d="M16 6.5c-.8-.5-1.3-1.4-1.3-2.5h-2.2v10.5a2 2 0 11-1.4-1.9V10.3a4.3 4.3 0 100 8.6 4.3 4.3 0 004.3-4.3V8.7c.8.5 1.7.8 2.6.8V7.3c-1 0-1.6-.3-2-.8z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    description: "Posts, pages, groups",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <rect width="24" height="24" rx="6" fill="#1877F2" />
        <path
          d="M16.5 12.5h-2.5v7h-3v-7h-2v-2.5h2V8.5c0-2 1-3.5 3.5-3.5h2v2.5h-1.5c-.7 0-1 .3-1 1v1.5h2.5l-.5 2.5z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    description: "Professional content",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <rect width="24" height="24" rx="6" fill="#0A66C2" />
        <path
          d="M8 17H5.5V10H8v7zM6.75 8.8a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8zM18.5 17H16v-3.5c0-1-.4-1.6-1.3-1.6s-1.3.7-1.3 1.6V17H11v-7h2.3v1c.5-.8 1.3-1.3 2.3-1.3 1.8 0 2.9 1.2 2.9 3.3V17z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    id: "pinterest",
    name: "Pinterest",
    color: "#E60023",
    description: "Pins, boards, ideas",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <rect width="24" height="24" rx="6" fill="#E60023" />
        <circle cx="12" cy="12" r="6" fill="none" stroke="#fff" strokeWidth="2" />
        <line x1="12" y1="12" x2="12" y2="18" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "discord",
    name: "Discord",
    color: "#5865F2",
    description: "Server announcements",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <rect width="24" height="24" rx="6" fill="#5865F2" />
        <path
          d="M16.8 8.2a11 11 0 00-2.7-.8l-.1.3c1 .2 1.8.6 2.6 1a10.5 10.5 0 00-8.2 0c.8-.4 1.7-.8 2.6-1l-.1-.3c-1 .1-2 .4-2.7.8C6 11.6 5.6 14.9 5.8 18.1c1.2.9 2.3 1.4 3.4 1.8.3-.4.5-.8.7-1.2a6 6 0 01-1.1-.5l.3-.2c2 1 4.3 1 6.3 0l.3.2c-.4.2-.7.4-1.1.5.2.4.5.8.7 1.2 1.1-.4 2.2-.9 3.4-1.8.3-3.6-.5-6.7-2.9-9.9zM9.7 16c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.4.7 1.4 1.6-.6 1.6-1.4 1.6zm4.6 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.4.7 1.4 1.6-.6 1.6-1.4 1.6z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    id: "slack",
    name: "Slack",
    color: "#4A154B",
    description: "Channel messaging",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <rect width="24" height="24" rx="6" fill="#4A154B" />
        <g fill="#fff">
          <circle cx="9" cy="7" r="1.5" />
          <rect x="8" y="8" width="2" height="4" rx="1" />
          <circle cx="15" cy="17" r="1.5" />
          <rect x="14" y="12" width="2" height="4" rx="1" />
          <circle cx="7" cy="15" r="1.5" />
          <rect x="8" y="14" width="4" height="2" rx="1" />
          <circle cx="17" cy="9" r="1.5" />
          <rect x="12" y="8" width="4" height="2" rx="1" />
        </g>
      </svg>
    ),
  },
];

// Platforms with fully implemented OAuth
const IMPLEMENTED_PLATFORMS = ["twitter", "linkedin"];

function isTokenExpired(expiresAt) {
  if (!expiresAt || expiresAt === 0) return false;
  return Date.now() > expiresAt;
}

function formatExpiry(expiresAt) {
  if (!expiresAt || expiresAt === 0) return "No expiry";
  const d = new Date(expiresAt);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AccountsPage() {
  const { user } = UserAuth();
  const { accounts, loading, fetchAccounts, removeAccount } = useAccountsStore();
  const [disconnecting, setDisconnecting] = useState(null);


  const handleConnect = (platformId) => {
    if (!user?.uid) {
      toast.error("You must be logged in to connect accounts.");
      return;
    }
    if (!IMPLEMENTED_PLATFORMS.includes(platformId)) {
      toast("Coming soon! This platform is not yet available.", {
        icon: "🔜",
      });
      return;
    }
    // Redirect to our OAuth initiation endpoint
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/api/oauth/${platformId}?userId=${user.uid}`;
  };

  const handleDisconnect = async (platformId) => {
    if (!user?.uid) return;
    setDisconnecting(platformId);
    try {
      await removeAccount(user.uid, platformId);
      toast.success(`Disconnected from ${PLATFORMS.find((p) => p.id === platformId)?.name}`);
    } catch (err) {
      console.error("Disconnect failed:", err);
      toast.error("Failed to disconnect. Please try again.");
    } finally {
      setDisconnecting(null);
    }
  };

  const getAccountData = (platformId) => {
    return accounts.find((a) => a.platform === platformId || a.id === platformId);
  };

  return (
    <div style={{ maxWidth: "1100px", position: "relative" }}>
      {/* Background watermark */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-10px",
          fontSize: "8rem",
          fontWeight: 900,
          color: "rgba(0,0,0,0.02)",
          letterSpacing: "-0.04em",
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        CONNECT
      </div>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "1.8rem",
            color: "#000",
            letterSpacing: "-0.03em",
            marginBottom: "6px",
          }}
        >
          Connected Accounts
        </h2>
        <p style={{ color: "#666", fontSize: "0.95rem", fontWeight: 500 }}>
          Connect your social platforms to start publishing.
          {accounts.length > 0 && (
            <span
              style={{
                marginLeft: "12px",
                background: "#5945FE",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "1.5px solid #000",
              }}
            >
              {accounts.length} connected
            </span>
          )}
        </p>
      </div>

      {/* Platform grid */}
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0",
            color: "#888",
            fontSize: "0.95rem",
            fontWeight: 600,
          }}
        >
          Loading accounts...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {PLATFORMS.map((p) => {
            const account = getAccountData(p.id);
            const isConnected = !!account;
            const expired = isConnected && isTokenExpired(account.expiresAt);
            const isImplemented = IMPLEMENTED_PLATFORMS.includes(p.id);
            const isDisconnecting = disconnecting === p.id;

            return (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  border: "2px solid #000",
                  borderRadius: "8px",
                  boxShadow: "3px 3px 0 #000",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  opacity: !isImplemented && !isConnected ? 0.65 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "12px" }}
                  >
                    {p.icon}
                    <div>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#000",
                          margin: 0,
                        }}
                      >
                        {p.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#888",
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {isConnected && !expired && (
                      <span
                        style={{
                          background: "#06D6A0",
                          color: "#fff",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          border: "1.5px solid #000",
                        }}
                      >
                        LIVE
                      </span>
                    )}
                    {expired && (
                      <span
                        style={{
                          background: "#FF4D6D",
                          color: "#fff",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          border: "1.5px solid #000",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        EXPIRED
                      </span>
                    )}
                    {!isImplemented && !isConnected && (
                      <span
                        style={{
                          background: "#f0f0f0",
                          color: "#999",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          border: "1.5px solid #ddd",
                        }}
                      >
                        SOON
                      </span>
                    )}
                  </div>
                </div>

                {/* Connected account details */}
                {isConnected && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "#f9f9f9",
                      border: "1.5px solid #e5e5e5",
                      borderRadius: "6px",
                      padding: "10px 12px",
                    }}
                  >
                    {account.avatarUrl ? (
                      <img
                        src={account.avatarUrl}
                        alt={account.handle}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          border: "1.5px solid #000",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: p.color,
                          border: "1.5px solid #000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                        }}
                      >
                        {(account.handle || "?")[0].toUpperCase()}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          color: "#000",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {account.handle || account.displayName}
                      </p>
                      <p
                        style={{
                          fontSize: "0.72rem",
                          color: expired ? "#FF4D6D" : "#888",
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        {expired
                          ? `Expired ${formatExpiry(account.expiresAt)}`
                          : account.expiresAt
                          ? `Expires ${formatExpiry(account.expiresAt)}`
                          : "Connected"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action button */}
                {isConnected ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    {expired && (
                      <button
                        onClick={() => handleConnect(p.id)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          background: "#5945FE",
                          color: "#fff",
                          border: "2px solid #000",
                          borderRadius: "6px",
                          boxShadow: "2px 2px 0 #000",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: "0.85rem",
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
                        Reconnect
                      </button>
                    )}
                    <button
                      onClick={() => handleDisconnect(p.id)}
                      disabled={isDisconnecting}
                      style={{
                        flex: expired ? "none" : 1,
                        padding: "10px",
                        background: "#fff",
                        color: "#FF4D6D",
                        border: "2px solid #000",
                        borderRadius: "6px",
                        boxShadow: "2px 2px 0 #000",
                        cursor: isDisconnecting ? "wait" : "pointer",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        opacity: isDisconnecting ? 0.6 : 1,
                        transition: "transform 0.1s, box-shadow 0.1s",
                        minWidth: expired ? "110px" : undefined,
                      }}
                      onMouseEnter={(e) => {
                        if (!isDisconnecting) {
                          e.currentTarget.style.transform = "translate(1px, 1px)";
                          e.currentTarget.style.boxShadow = "1px 1px 0 #000";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "2px 2px 0 #000";
                      }}
                    >
                      {isDisconnecting ? "Removing..." : "Disconnect"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect(p.id)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: isImplemented ? p.color : "#e5e5e5",
                      color: isImplemented ? "#fff" : "#999",
                      border: "2px solid #000",
                      borderRadius: "6px",
                      boxShadow: "2px 2px 0 #000",
                      cursor: isImplemented ? "pointer" : "default",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      transition: "transform 0.1s, box-shadow 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (isImplemented) {
                        e.currentTarget.style.transform = "translate(1px, 1px)";
                        e.currentTarget.style.boxShadow = "1px 1px 0 #000";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "2px 2px 0 #000";
                    }}
                  >
                    {isImplemented ? "Connect" : "Coming Soon"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
