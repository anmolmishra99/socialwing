"use client";

export default function DashboardHome({ user, onNavigate }) {
  const stats = [
    {
      label: "Posts This Week",
      value: "0",
      delta: "+0%",
      color: "#5945FE",
      bg: "#EEF0FF",
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#5945FE"
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
      label: "Scheduled",
      value: "0",
      delta: "0 pending",
      color: "#FF6B35",
      bg: "#FFF0EA",
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#FF6B35"
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
      label: "Connected",
      value: "0",
      delta: "Add account →",
      color: "#06D6A0",
      bg: "#E6FBF5",
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#06D6A0"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101"
          />
        </svg>
      ),
    },
    {
      label: "Engagement",
      value: "0%",
      delta: "No data yet",
      color: "#FF4D6D",
      bg: "#FFF0F3",
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#FF4D6D"
          strokeWidth="2"
        >
          <polyline
            strokeLinecap="round"
            strokeLinejoin="round"
            points="22 12 18 12 15 21 9 3 6 12 2 12"
          />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      label: "Create New Post",
      tab: "Create Post",
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
    },
    {
      label: "Connect Account",
      tab: "Accounts",
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
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101"
          />
        </svg>
      ),
    },
    {
      label: "View Calendar",
      tab: "Calendar",
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
      label: "Set Up Auto Reply",
      tab: "Auto Reply",
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
        </svg>
      ),
    },
  ];

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
        OVERVIEW
      </div>

      {/* Welcome */}
      <div style={{ marginBottom: "36px" }}>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "1.8rem",
            color: "#000",
            letterSpacing: "-0.03em",
            marginBottom: "6px",
          }}
        >
          Welcome back, {user?.displayName?.split(" ")[0] || "there"}
        </h2>
        <p style={{ color: "#666", fontSize: "1rem", fontWeight: 500 }}>
          Here is what is happening with your social accounts today.
        </p>
      </div>

      {/* ── Stats Grid (redesigned) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              border: "2px solid #000",
              borderRadius: "10px",
              boxShadow: "4px 4px 0 #000",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Colour accent bar at top */}
            <div
              style={{
                height: "4px",
                background: stat.color,
                width: "100%",
              }}
            />

            <div style={{ padding: "20px 22px 22px" }}>
              {/* Icon + label row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "9px",
                    background: stat.bg,
                    border: `1.5px solid ${stat.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    lineHeight: 1.3,
                  }}
                >
                  {stat.label}
                </span>
              </div>

              {/* Value */}
              <div
                style={{
                  fontSize: "2.4rem",
                  fontWeight: 900,
                  color: "#000",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: "10px",
                }}
              >
                {stat.value}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "#f0f0f0",
                  marginBottom: "10px",
                }}
              />

              {/* Delta / sub-label */}
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: stat.color,
                  letterSpacing: "0.02em",
                }}
              >
                {stat.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "40px" }}>
        <h3
          style={{
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "#888",
            marginBottom: "16px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Quick Actions
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate?.(action.tab)}
              style={{
                background: "#fff",
                border: "2px solid #000",
                borderRadius: "8px",
                boxShadow: "3px 3px 0 #000",
                padding: "16px 20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "transform 0.1s, box-shadow 0.1s",
                textAlign: "left",
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
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3
          style={{
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "#888",
            marginBottom: "16px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Recent Activity
        </h3>
        <div
          style={{
            background: "#fff",
            border: "2px solid #000",
            borderRadius: "8px",
            boxShadow: "3px 3px 0 #000",
            padding: "48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "6rem",
              fontWeight: 900,
              color: "rgba(0,0,0,0.02)",
              pointerEvents: "none",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            NO ACTIVITY
          </span>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#f5f5f5",
              border: "1.5px solid #eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#bbb"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0l-7-7-7 7"
              />
            </svg>
          </div>
          <p
            style={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#000",
              position: "relative",
            }}
          >
            No activity yet
          </p>
          <p
            style={{
              fontWeight: 500,
              fontSize: "0.88rem",
              color: "#999",
              textAlign: "center",
              maxWidth: "320px",
              position: "relative",
            }}
          >
            Connect your social accounts and start posting to see your activity
            here.
          </p>
        </div>
      </div>
    </div>
  );
}
