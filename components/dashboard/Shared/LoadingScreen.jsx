"use client";

export default function LoadingScreen() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        fontFamily: "'Inter', sans-serif",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "32px",
          animation: "loadPulse 1.8s ease-in-out infinite",
        }}
      >
        <img 
          src="/assets/images/logo.png" 
          alt="SocialWing Logo" 
          style={{ height: "48px", width: "auto" }} 
        />
      </div>

      <div
        style={{
          width: "200px",
          height: "4px",
          background: "#f0f0f0",
          borderRadius: "2px",
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "40%",
            height: "100%",
            background: "#5945FE",
            borderRadius: "2px",
            animation: "loadBar 1.2s ease-in-out infinite",
          }}
        />
      </div>

      <p
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#888",
          letterSpacing: "0.02em",
        }}
      >
        Loading your workspace...
      </p>

      <style>{`
        @keyframes loadPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.97); }
        }
        @keyframes loadBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
