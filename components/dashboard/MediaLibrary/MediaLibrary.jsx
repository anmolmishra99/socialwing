"use client";

import { useState } from "react";

export default function MediaLibrary() {
  const [dragOver, setDragOver] = useState(false);
  const [files] = useState([]);

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); };

  return (
    <div style={{ maxWidth: "1100px", position: "relative" }}>
      <div style={{ position: "absolute", top: "-20px", right: "-10px", fontSize: "8rem", fontWeight: 900, color: "rgba(0,0,0,0.02)", letterSpacing: "-0.04em", pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>MEDIA</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "1.8rem", color: "#000", letterSpacing: "-0.03em", marginBottom: "6px" }}>Media Library</h2>
          <p style={{ color: "#666", fontSize: "0.95rem", fontWeight: 500 }}>Upload and manage your images, videos, and files.</p>
        </div>
        <button style={{ background: "#5945FE", color: "#fff", border: "2px solid #000", borderRadius: "6px", boxShadow: "3px 3px 0 #000", padding: "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", transition: "transform 0.1s, box-shadow 0.1s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "1px 1px 0 #000"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "3px 3px 0 #000"; }}
        >+ Upload Files</button>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          background: dragOver ? "#f0eeff" : "#fff",
          border: `2px ${dragOver ? "solid" : "dashed"} ${dragOver ? "#5945FE" : "#000"}`,
          borderRadius: "8px",
          boxShadow: dragOver ? "4px 4px 0 #5945FE" : "3px 3px 0 #000",
          padding: "60px 40px", textAlign: "center", marginBottom: "32px",
          cursor: "pointer", transition: "all 0.15s",
        }}
      >
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke={dragOver ? "#5945FE" : "#bbb"} strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#000", marginBottom: "6px" }}>Drag and drop files here</p>
        <p style={{ fontSize: "0.85rem", color: "#888", fontWeight: 500 }}>or click to browse — JPG, PNG, GIF, MP4 — Max 50 MB</p>
      </div>

      {/* Media Grid */}
      {files.length === 0 ? (
        <div style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "3px 3px 0 #000", padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "6rem", fontWeight: 900, color: "rgba(0,0,0,0.02)", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>EMPTY</span>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#ccc" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
          <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#000", marginBottom: "6px", position: "relative" }}>No media uploaded yet</p>
          <p style={{ fontSize: "0.9rem", color: "#888", fontWeight: 500, maxWidth: "340px", margin: "0 auto", position: "relative" }}>
            Upload images and videos to use in your social media posts. They will be stored securely in your library.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
          {files.map((file, i) => (
            <div key={i} style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "2px 2px 0 #000", overflow: "hidden" }}>
              <div style={{ height: "140px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#ddd" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
              </div>
              <div style={{ padding: "10px" }}>
                <p style={{ fontWeight: 600, fontSize: "0.8rem", color: "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</p>
                <p style={{ fontSize: "0.7rem", color: "#999" }}>{file.size}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
