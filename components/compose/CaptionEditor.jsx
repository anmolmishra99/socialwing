"use client";

import { useState, useEffect } from "react";

export default function CaptionEditor({ value, onChange, selectedPlatforms }) {
  const [charLimit, setCharLimit] = useState(280);

  useEffect(() => {
    // If only LinkedIn is selected, or others are longer, set limit higher
    // Twitter is always the primary constraint at 280
    if (selectedPlatforms.includes("twitter")) {
      setCharLimit(280);
    } else if (selectedPlatforms.includes("linkedin")) {
      setCharLimit(3000);
    } else {
      setCharLimit(2200); // General limit (IG/FB)
    }
  }, [selectedPlatforms]);

  const charCount = value.length;

  return (
    <div
      style={{
        background: "#fff",
        border: "3.5px solid #000",
        borderRadius: "12px",
        boxShadow: "6px 6px 0 #000",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Draft your post here..."
        style={{
          width: "100%",
          minHeight: "200px",
          border: "none",
          outline: "none",
          fontSize: "1.1rem",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          resize: "vertical",
          lineHeight: 1.5,
          color: "#000",
          background: "transparent",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "2px solid #000",
          paddingTop: "16px",
          marginTop: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          {/* Action buttons could go here */}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: 900,
              color: charCount > charLimit ? "#FF4D6D" : "#000",
              letterSpacing: "-0.02em"
            }}
          >
            {charCount} / {charLimit}
          </span>
          {charCount > charLimit && (
            <span
              style={{
                fontSize: "0.75rem",
                background: "#FF4D6D",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: "6px",
                fontWeight: 900,
                textTransform: "uppercase",
                border: "2px solid #000"
              }}
            >
              LIMIT EXCEEDED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
