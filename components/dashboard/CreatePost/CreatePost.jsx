"use client";

import { useState } from "react";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", color: "#E4405F" },
  { id: "twitter", name: "X / Twitter", color: "#000000" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2" },
  { id: "facebook", name: "Facebook", color: "#1877F2" },
  { id: "youtube", name: "YouTube", color: "#FF0000" },
  { id: "tiktok", name: "TikTok", color: "#000000" },
  { id: "pinterest", name: "Pinterest", color: "#E60023" },
  { id: "discord", name: "Discord", color: "#5865F2" },
  { id: "slack", name: "Slack", color: "#4A154B" },
];

export default function CreatePost() {
  const [postText, setPostText] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [scheduleType, setScheduleType] = useState("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const charCount = postText.length;

  return (
    <div style={{ maxWidth: "900px", position: "relative" }}>
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
        COMPOSE
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
        Create New Post
      </h2>
      <p
        style={{
          color: "#666",
          fontSize: "0.95rem",
          marginBottom: "32px",
          fontWeight: 500,
        }}
      >
        Write once, publish everywhere.
      </p>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Left - Editor */}
        <div style={{ flex: "1 1 480px", minWidth: 0 }}>
          {/* Text area */}
          <div
            style={{
              background: "#fff",
              border: "2px solid #000",
              borderRadius: "8px",
              boxShadow: "3px 3px 0 #000",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's on your mind? Write your post here..."
              style={{
                width: "100%",
                minHeight: "180px",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                fontFamily: "'Inter', sans-serif",
                resize: "vertical",
                lineHeight: 1.6,
                color: "#000",
                background: "transparent",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #eee",
                paddingTop: "12px",
                marginTop: "8px",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    background: "#f5f5f5",
                    border: "1.5px solid #ddd",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#555",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
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
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Media
                </button>
                <button
                  style={{
                    background: "#f0eeff",
                    border: "1.5px solid #d4cfff",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#5945FE",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#5945FE"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Generate with AI
                </button>
              </div>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: charCount > 280 ? "#FF4D6D" : "#aaa",
                }}
              >
                {charCount} characters
              </span>
            </div>
          </div>

          {/* Platform selector */}
          <div
            style={{
              background: "#fff",
              border: "2px solid #000",
              borderRadius: "8px",
              boxShadow: "3px 3px 0 #000",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.82rem",
                color: "#888",
                marginBottom: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Publish to
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {PLATFORMS.map((p) => {
                const selected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 14px",
                      background: selected ? p.color : "#fff",
                      color: selected ? "#fff" : "#333",
                      border: "2px solid #000",
                      borderRadius: "6px",
                      boxShadow: selected ? "2px 2px 0 #000" : "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      transition: "all 0.1s",
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule */}
          <div
            style={{
              background: "#fff",
              border: "2px solid #000",
              borderRadius: "8px",
              boxShadow: "3px 3px 0 #000",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.82rem",
                color: "#888",
                marginBottom: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Schedule
            </p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              {[
                { value: "now", label: "Post Now" },
                { value: "schedule", label: "Schedule" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setScheduleType(opt.value)}
                  style={{
                    padding: "8px 20px",
                    background: scheduleType === opt.value ? "#5945FE" : "#fff",
                    color: scheduleType === opt.value ? "#fff" : "#333",
                    border: "2px solid #000",
                    borderRadius: "6px",
                    boxShadow:
                      scheduleType === opt.value ? "2px 2px 0 #000" : "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {scheduleType === "schedule" && (
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  style={{
                    padding: "8px 14px",
                    border: "2px solid #000",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                  }}
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  style={{
                    padding: "8px 14px",
                    border: "2px solid #000",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            disabled={!postText.trim() || selectedPlatforms.length === 0}
            style={{
              width: "100%",
              padding: "16px",
              background:
                postText.trim() && selectedPlatforms.length > 0
                  ? "#5945FE"
                  : "#ccc",
              color: "#fff",
              border: "2px solid #000",
              borderRadius: "8px",
              boxShadow:
                postText.trim() && selectedPlatforms.length > 0
                  ? "4px 4px 0 #000"
                  : "none",
              cursor:
                postText.trim() && selectedPlatforms.length > 0
                  ? "pointer"
                  : "not-allowed",
              fontWeight: 700,
              fontSize: "1rem",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseEnter={(e) => {
              if (postText.trim() && selectedPlatforms.length > 0) {
                e.currentTarget.style.transform = "translate(2px, 2px)";
                e.currentTarget.style.boxShadow = "2px 2px 0 #000";
              }
            }}
            onMouseLeave={(e) => {
              if (postText.trim() && selectedPlatforms.length > 0) {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "4px 4px 0 #000";
              }
            }}
          >
            {scheduleType === "now"
              ? `Publish to ${selectedPlatforms.length} platform${selectedPlatforms.length !== 1 ? "s" : ""}`
              : `Schedule for ${selectedPlatforms.length} platform${selectedPlatforms.length !== 1 ? "s" : ""}`}
          </button>
        </div>

        {/* Right - Preview */}
        <div style={{ flex: "0 0 280px" }}>
          <div
            style={{
              background: "#fff",
              border: "2px solid #000",
              borderRadius: "8px",
              boxShadow: "3px 3px 0 #000",
              padding: "20px",
              position: "sticky",
              top: "20px",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.82rem",
                color: "#888",
                marginBottom: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Preview
            </p>
            <div
              style={{
                background: "#f9f9f9",
                border: "1.5px solid #eee",
                borderRadius: "6px",
                padding: "16px",
                minHeight: "120px",
              }}
            >
              {postText ? (
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#333",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {postText}
                </p>
              ) : (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#bbb",
                    fontStyle: "italic",
                  }}
                >
                  Your post preview will appear here...
                </p>
              )}
            </div>
            {selectedPlatforms.length > 0 && (
              <div style={{ marginTop: "14px" }}>
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#888",
                    marginBottom: "8px",
                  }}
                >
                  Publishing to::
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selectedPlatforms.map((id) => {
                    const p = PLATFORMS.find((pl) => pl.id === id);
                    return (
                      <span
                        key={id}
                        style={{
                          padding: "3px 8px",
                          background: p.color,
                          color: "#fff",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}
                      >
                        {p.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
