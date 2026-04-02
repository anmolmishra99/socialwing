"use client";

import { useAccountsStore } from "@/store/accountsStore";

export default function PostPreview({ content, media, selectedPlatforms, user }) {
  if (!content && media.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          border: "2px solid #000",
          borderRadius: "8px",
          boxShadow: "3px 3px 0 #000",
          padding: "32px 20px",
          textAlign: "center",
          color: "#bbb",
          fontStyle: "italic",
          fontSize: "0.85rem",
        }}
      >
        Your preview will appear here as you type...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {selectedPlatforms.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "2px solid #000",
            borderRadius: "8px",
            boxShadow: "3px 3px 0 #000",
            padding: "20px",
            fontSize: "0.85rem",
            color: "#888",
            fontWeight: 600,
            textAlign: "center"
          }}
        >
          Select a platform to see a live preview.
        </div>
      ) : (
        selectedPlatforms.map((platform) => (
          <div
            key={platform}
            style={{
              background: "#fff",
              border: "2px solid #000",
              borderRadius: "8px",
              boxShadow: "3px 3px 0 #000",
              overflow: "hidden",
            }}
          >
            {/* Platform Header */}
            <div
              style={{
                padding: "8px 12px",
                borderBottom: "1.5px solid #000",
                background: "#f8f8f8",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  background: platform === "twitter" ? "#000" : platform === "linkedin" ? "#0A66C2" : "#ccc",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "0.6rem",
                  fontWeight: 900,
                }}
              >
                {platform[0].toUpperCase()}
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "capitalize" }}>
                {platform} Preview
              </span>
            </div>

            {/* Content Area */}
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#000",
                    border: "2px solid #000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "0.9rem",
                  }}
                >
                  {user?.displayName ? user.displayName[0] : "U"}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 900, color: "#000" }}>
                    {user?.displayName || "You"}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#000", fontWeight: 700, opacity: 0.6 }}>
                    Just now
                  </p>
                </div>
              </div>

              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: "#000",
                  fontWeight: 600,
                  margin: "0 0 16px 0",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {content || <span style={{ color: "#000", opacity: 0.3 }}>Post text will go here...</span>}
              </p>

              {media.length > 0 && (
                <div
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "3px solid #000",
                    background: "#fcfcfc",
                    boxShadow: "3px 3px 0 #000"
                  }}
                >
                  <img
                    src={media[0].url}
                    alt="Preview"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              )}
            </div>
            
            {/* Fake Footer */}
            <div
               style={{
                padding: "12px 20px",
                borderTop: "2px solid #000",
                display: "flex",
                gap: "24px",
                color: "#000"
              }}
            >
               <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "0.85rem", fontWeight: 800 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  <span>0</span>
               </div>
               <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "0.85rem", fontWeight: 800 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4.5 12.5l6 6 9-9" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>0</span>
               </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
