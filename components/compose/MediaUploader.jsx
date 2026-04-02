"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function MediaUploader({ userId, media, onAdd, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onAdd({
          url: data.url,
          fileId: data.fileId,
          mediaId: data.mediaId,
        });
        toast.success("Image uploaded successfully! 📸");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
      <p
        style={{
          fontWeight: 900,
          fontSize: "0.9rem",
          color: "#000",
          marginBottom: "18px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Media Assets
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {media.map((m) => (
          <div
            key={m.fileId}
            style={{
              position: "relative",
              width: "140px",
              height: "140px",
              borderRadius: "10px",
              border: "3px solid #000",
              overflow: "hidden",
              boxShadow: "4px 4px 0 #000",
            }}
          >
            <img
              src={m.url}
              alt="Uploaded"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              onClick={() => onRemove(m.fileId)}
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                background: "#FF4D6D",
                color: "#fff",
                border: "2px solid #000",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                boxShadow: "1px 1px 0 #000"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            width: "140px",
            height: "140px",
            background: "#fff",
            border: "3px dashed #000",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: uploading ? "wait" : "pointer",
            gap: "10px",
            transition: "all 0.1s",
          }}
          onMouseEnter={(e) => {
            if (!uploading) e.currentTarget.style.background = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            if (!uploading) e.currentTarget.style.background = "#fff";
          }}
        >
          {uploading ? (
            <span style={{ fontSize: "0.85rem", fontWeight: 900, color: "#000" }}>UPLOADING...</span>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span style={{ fontSize: "0.85rem", fontWeight: 900, color: "#000" }}>ADD MEDIA</span>
            </>
          )}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
}
