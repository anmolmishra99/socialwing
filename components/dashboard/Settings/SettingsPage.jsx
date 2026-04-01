"use client";

import { useState } from "react";
import { UserAuth } from "@/app/context/AuthContext";

export default function SettingsPage() {
  const { user } = UserAuth();

  const [notifications, setNotifications] = useState({
    "Email notifications for published posts": true,
    "Weekly performance digest": true,
    "Auto-reply activity alerts": false,
  });

  const toggleNotif = (label) => {
    setNotifications((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const sectionStyle = {
    background: "#fff",
    border: "2px solid #000",
    borderRadius: "10px",
    boxShadow: "4px 4px 0 #000",
    padding: "28px",
    marginBottom: "20px",
  };

  const sectionHeadingStyle = {
    fontWeight: 700,
    fontSize: "0.78rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const labelStyle = {
    fontWeight: 700,
    fontSize: "0.74rem",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    display: "block",
    marginBottom: "6px",
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    border: "2px solid #000",
    borderRadius: "7px",
    fontSize: "0.92rem",
    fontFamily: "inherit",
    fontWeight: 600,
    color: "#000",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: "700px", position: "relative" }}>
      {/* Watermark */}
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
        CONFIG
      </div>

      <h2
        style={{
          fontWeight: 800,
          fontSize: "1.8rem",
          color: "#000",
          letterSpacing: "-0.03em",
          marginBottom: "8px",
        }}
      >
        Settings
      </h2>
      <p
        style={{
          color: "#666",
          fontSize: "0.95rem",
          marginBottom: "36px",
          fontWeight: 500,
        }}
      >
        Manage your account and preferences.
      </p>

      {/* ── Profile ── */}
      <div style={sectionStyle}>
        <h3 style={sectionHeadingStyle}>
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#888"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
            />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </h3>

        {/* Avatar row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px",
            background: "#fafafa",
            border: "1.5px solid #eee",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              background: "#E0E7FF",
              border: "2px solid #000",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "1.4rem",
              color: "#5945FE",
              boxShadow: "2px 2px 0 #000",
              flexShrink: 0,
            }}
          >
            {user?.displayName?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p
              style={{
                fontWeight: 800,
                fontSize: "1.05rem",
                color: "#000",
                marginBottom: "2px",
              }}
            >
              {user?.displayName || "User"}
            </p>
            <p style={{ fontSize: "0.82rem", color: "#888", fontWeight: 500 }}>
              {user?.email || "No email"}
            </p>
          </div>
          <div
            style={{
              marginLeft: "auto",
              padding: "4px 10px",
              background: "#f0eeff",
              border: "1.5px solid #d4cfff",
              borderRadius: "5px",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#5945FE",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Free
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Display Name</label>
            <input defaultValue={user?.displayName || ""} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              value={user?.email || ""}
              disabled
              style={{
                ...inputStyle,
                border: "2px solid #e5e5e5",
                background: "#f9f9f9",
                color: "#aaa",
                cursor: "not-allowed",
              }}
            />
          </div>
          <button
            style={{
              alignSelf: "flex-start",
              padding: "10px 22px",
              background: "#000",
              color: "#fff",
              border: "2px solid #000",
              borderRadius: "7px",
              boxShadow: "3px 3px 0 #5945FE",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.85rem",
              marginTop: "4px",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow = "1px 1px 0 #5945FE";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "3px 3px 0 #5945FE";
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Billing ── */}
      <div style={sectionStyle}>
        <h3 style={sectionHeadingStyle}>
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#888"
            strokeWidth="2.5"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          Billing &amp; Plan
        </h3>

        {/* Plan card */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fafafa",
            border: "1.5px solid #eee",
            borderRadius: "8px",
            padding: "18px 20px",
            marginBottom: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontWeight: 800,
                fontSize: "1rem",
                color: "#000",
                marginBottom: "4px",
              }}
            >
              Free Plan
            </p>
            <p style={{ fontSize: "0.8rem", color: "#888", fontWeight: 500 }}>
              3 connected accounts · 10 posts per month
            </p>
          </div>
          <span
            style={{
              background: "#f0eeff",
              color: "#5945FE",
              padding: "5px 12px",
              borderRadius: "5px",
              fontSize: "0.72rem",
              fontWeight: 700,
              border: "1.5px solid #d4cfff",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            Current
          </span>
        </div>

        {/* Upgrade CTA */}
        <div
          style={{
            background: "#f0eeff",
            border: "2px solid #5945FE",
            borderRadius: "8px",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "0",
          }}
        >
          <div>
            <p
              style={{
                fontWeight: 800,
                fontSize: "0.95rem",
                color: "#000",
                marginBottom: "3px",
              }}
            >
              Premium Plan
            </p>
            <p
              style={{ fontSize: "0.8rem", color: "#5945FE", fontWeight: 600 }}
            >
              Unlimited accounts · Unlimited posts · Analytics
            </p>
          </div>
          <button
            style={{
              padding: "12px 22px",
              background: "#5945FE",
              color: "#fff",
              border: "2px solid #000",
              borderRadius: "7px",
              boxShadow: "3px 3px 0 #000",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow = "1px 1px 0 #000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "3px 3px 0 #000";
            }}
          >
            Upgrade — $19/mo
          </button>
        </div>
      </div>

      {/* ── Notifications ── */}
      <div style={sectionStyle}>
        <h3 style={sectionHeadingStyle}>
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#888"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17H9m9.27-2A7 7 0 105 10.5V14l-1 3h14l-1-3v-.73z"
            />
          </svg>
          Notifications
        </h3>

        {Object.entries(notifications).map(([label, on], i, arr) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "13px 0",
              borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none",
            }}
          >
            <span
              style={{ fontSize: "0.9rem", fontWeight: 600, color: "#222" }}
            >
              {label}
            </span>
            <div
              onClick={() => toggleNotif(label)}
              style={{
                width: "42px",
                height: "24px",
                background: on ? "#5945FE" : "#ddd",
                borderRadius: "12px",
                border: "2px solid #000",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.15s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  background: "#fff",
                  borderRadius: "50%",
                  border: "1.5px solid #000",
                  position: "absolute",
                  top: "2px",
                  left: on ? "20px" : "2px",
                  transition: "left 0.15s",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Danger Zone ── */}
      <div
        style={{
          background: "#fff",
          border: "2px solid #FF4D6D",
          borderRadius: "10px",
          boxShadow: "4px 4px 0 #FF4D6D",
          padding: "28px",
        }}
      >
        <h3
          style={{
            fontWeight: 700,
            fontSize: "0.78rem",
            color: "#FF4D6D",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#FF4D6D"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          Danger Zone
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#888",
            fontWeight: 500,
            marginBottom: "16px",
          }}
        >
          Permanently delete your account and all data. This cannot be undone.
        </p>
        <button
          style={{
            padding: "10px 20px",
            background: "#fff",
            color: "#FF4D6D",
            border: "2px solid #FF4D6D",
            borderRadius: "7px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.85rem",
            boxShadow: "3px 3px 0 #FF4D6D",
            transition: "transform 0.1s, box-shadow 0.1s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(2px, 2px)";
            e.currentTarget.style.boxShadow = "1px 1px 0 #FF4D6D";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "3px 3px 0 #FF4D6D";
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
