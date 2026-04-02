"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AIAssistant({ onGenerate, selectedPlatforms }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          platforms: selectedPlatforms,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onGenerate(data.caption);
        toast.success("AI generated your caption! ✨");
        setPrompt(""); // Clear prompt after generation
      } else {
        throw new Error(data.error || "Failed to generate");
      }
    } catch (err) {
      console.error(err);
      toast.error("AI couldn't generate a caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#F5F3FF",
        border: "3.5px solid #5945FE",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "4px 4px 0 #5945FE20"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "1.4rem" }}>✨</span>
        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 900, color: "#5945FE", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Ghostwriter</h4>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="I want a post about..."
          style={{
            flex: 1,
            padding: "12px 18px",
            border: "3px solid #000",
            borderRadius: "10px",
            fontSize: "1rem",
            fontWeight: 700,
            outline: "none",
            background: "#fff",
            color: "#000",
          }}
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          style={{
            background: "#000",
            color: "#fff",
            border: "3px solid #000",
            borderRadius: "10px",
            padding: "0 28px",
            fontWeight: 900,
            fontSize: "0.95rem",
            cursor: loading ? "wait" : "pointer",
            opacity: loading || !prompt.trim() ? 0.6 : 1,
            transition: "all 0.1s",
            boxShadow: loading ? "none" : "3px 3px 0 #5945FE"
          }}
        >
          {loading ? "WRITING..." : "GENERATE"}
        </button>
      </div>
    </div>
  );
}
