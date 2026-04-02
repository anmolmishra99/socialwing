"use client";

import { useState } from "react";
import { UserAuth } from "@/app/context/AuthContext";
import PlatformSelector from "@/components/compose/PlatformSelector";
import CaptionEditor from "@/components/compose/CaptionEditor";
import AIAssistant from "@/components/compose/AIAssistant";
import MediaUploader from "@/components/compose/MediaUploader";
import SchedulePicker from "@/components/compose/SchedulePicker";
import PostPreview from "@/components/compose/PostPreview";
import toast from "react-hot-toast";

export default function CreatePost() {
  const { user } = UserAuth();
  
  // State
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [scheduleType, setScheduleType] = useState("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAddMedia = (asset) => {
    setMedia((prev) => [...prev, asset]);
  };

  const handleRemoveMedia = (fileId) => {
    setMedia((prev) => prev.filter((m) => m.fileId !== fileId));
  };

  const handleSubmit = async () => {
    if (!content && media.length === 0) {
      toast.error("Please add some content or media first.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform.");
      return;
    }

    setIsSubmitting(true);
    
    let scheduledAt = null;
    if (scheduleType === "schedule" && scheduleDate && scheduleTime) {
      scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    }

    const postData = {
      userId: user.uid,
      content,
      media,
      platforms: selectedPlatforms,
      scheduledAt,
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          scheduleType === "now" 
            ? "Post published successfully! 🚀" 
            : "Post scheduled successfully! 📅"
        );
        // Reset form
        setContent("");
        setMedia([]);
        setSelectedPlatforms([]);
        setScheduleType("now");
      } else {
        throw new Error(data.error || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        COMPOSE
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontWeight: 900,
            fontSize: "2.4rem",
            color: "#000",
            letterSpacing: "-0.04em",
            marginBottom: "8px",
            lineHeight: 1,
          }}
        >
          Compose Post
        </h2>
        <p style={{ color: "#000", fontSize: "1.1rem", fontWeight: 700, opacity: 0.8 }}>
          Draft across platforms with AI assistance and smart scheduling.
        </p>
      </div>

      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Left Column - Editor */}
        <div style={{ flex: "1 1 600px", minWidth: 0 }}>
          
          <div style={{ marginBottom: "32px" }}>
             <p style={{ fontWeight: 900, fontSize: "0.9rem", color: "#000", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                1. Select Target Accounts
             </p>
             <PlatformSelector 
                selectedPlatforms={selectedPlatforms} 
                onToggle={togglePlatform} 
             />
          </div>

          <div style={{ marginBottom: "32px" }}>
             <p style={{ fontWeight: 900, fontSize: "0.9rem", color: "#000", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                2. Enhance with AI
             </p>
             <AIAssistant 
                selectedPlatforms={selectedPlatforms} 
                onGenerate={(txt) => setContent(txt)} 
              />
          </div>

          <div style={{ marginBottom: "32px" }}>
             <p style={{ fontWeight: 900, fontSize: "0.9rem", color: "#000", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                3. Finalize Content
             </p>
             <CaptionEditor 
                value={content} 
                onChange={setContent} 
                selectedPlatforms={selectedPlatforms} 
              />

              <MediaUploader 
                userId={user?.uid} 
                media={media} 
                onAdd={handleAddMedia} 
                onRemove={handleRemoveMedia} 
              />
          </div>

          <div style={{ marginBottom: "32px" }}>
             <p style={{ fontWeight: 900, fontSize: "0.9rem", color: "#000", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                4. Timing
             </p>
             <SchedulePicker 
                scheduleType={scheduleType}
                onTypeChange={setScheduleType}
                date={scheduleDate}
                time={scheduleTime}
                onDateChange={setScheduleDate}
                onTimeChange={setScheduleTime}
              />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!content && media.length === 0) || selectedPlatforms.length === 0}
            style={{
              width: "100%",
              padding: "20px",
              background: (isSubmitting || (!content && media.length === 0) || selectedPlatforms.length === 0) ? "#eee" : "#000",
              color: (isSubmitting || (!content && media.length === 0) || selectedPlatforms.length === 0) ? "#999" : "#fff",
              border: "4px solid #000",
              borderRadius: "14px",
              boxShadow: (isSubmitting || (!content && media.length === 0) || selectedPlatforms.length === 0) ? "none" : "6px 6px 0 #5945FE",
              cursor: (isSubmitting || (!content && media.length === 0) || selectedPlatforms.length === 0) ? "not-allowed" : "pointer",
              fontWeight: 900,
              fontSize: "1.2rem",
              transition: "all 0.1s",
              position: "relative",
              overflow: "hidden",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            {isSubmitting ? "PROCESSING..." : scheduleType === "now" ? "PUBLISH NOW" : "SCHEDULE DEPLOYMENT"}
          </button>
        </div>

        {/* Right Column - Preview (Sticky) */}
        <div style={{ flex: "0 0 360px", position: "sticky", top: "20px" }}>
          <p style={{ fontWeight: 900, fontSize: "0.9rem", color: "#000", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Deployment Preview
          </p>
          <PostPreview 
            content={content} 
            media={media} 
            selectedPlatforms={selectedPlatforms} 
            user={user} 
          />
          
          {selectedPlatforms.length > 0 && (
            <div style={{ marginTop: "24px", padding: "20px", background: "#fff", border: "3px solid #000", borderRadius: "12px", boxShadow: "4px 4px 0 #000" }}>
              <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem", fontWeight: 900, color: "#000", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Targeting ({selectedPlatforms.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                 {selectedPlatforms.map(p => (
                   <div key={p} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#06D6A0", border: "1.5px solid #000" }} />
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#000", textTransform: "capitalize" }}>{p}</span>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
