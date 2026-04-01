import { useEffect, useRef } from "react";

const styles = {
  // Google Fonts injected via useEffect
};

export const HeroSection = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const btnHover = (e) => {
    e.currentTarget.style.transform = "translate(3px, 3px)";
    e.currentTarget.style.boxShadow = "1px 1px 0 #000";
  };
  const btnLeave = (e) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "4px 4px 0 #000";
  };
  const badgeHover = (e) => {
    e.currentTarget.style.transform = "translate(2px, 2px)";
    e.currentTarget.style.boxShadow = "1px 1px 0 #000";
  };
  const badgeLeave = (e) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "3px 3px 0 #000";
  };
  const chipHover = (e) => {
    e.currentTarget.style.transform = "translate(2px, 2px) scale(1.08)";
    e.currentTarget.style.boxShadow = "0 0 0 #ddd";
    e.currentTarget.style.borderColor = "#000";
  };
  const chipLeave = (e) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "2px 2px 0 #ddd";
    e.currentTarget.style.borderColor = "#e0e0e0";
  };

  const socialPlatforms = [
    {
      name: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22">
          <defs>
            <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#ig)" />
          <circle
            cx="12"
            cy="12"
            r="4.5"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
        </svg>
      ),
    },
    {
      name: "X / Twitter",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#0a0a0a">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.265 5.64L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#0a0a0a">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 100 12.63 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#E60023">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
    },
    {
      name: "Threads",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#0a0a0a">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.851 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.859 3.13 3.513 5.467l-2.726.62c-1.063-3.723-3.469-5.631-7.617-5.664-2.734.018-4.906.82-6.453 2.38-1.476 1.485-2.237 3.618-2.262 6.34.025 2.718.786 4.851 2.262 6.341 1.547 1.561 3.719 2.363 6.453 2.38h.007c2.496-.015 4.404-.544 5.872-1.615 1.589-1.155 2.395-2.885 2.395-5.14 0-.665-.074-1.28-.223-1.832-.302-1.127-.854-1.992-1.642-2.574-.786-.58-1.811-.879-3.052-.892-1.163.013-2.117.332-2.835.949z" />
        </svg>
      ),
    },
  ];

  const marqueeRow1 = [
    {
      label: "YouTube",
      color: "#FF0000",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "Twitter / X",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#000">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.265 5.64L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20">
          <defs>
            <linearGradient id="igm" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#igm)" />
          <circle
            cx="12"
            cy="12"
            r="4.5"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
        </svg>
      ),
    },
    {
      label: "TikTok",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#000">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 100 12.63 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
        </svg>
      ),
    },
    {
      label: "Pinterest",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#E60023">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
    },
    {
      label: "Threads",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#000">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.851 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.859 3.13 3.513 5.467l-2.726.62c-1.063-3.723-3.469-5.631-7.617-5.664-2.734.018-4.906.82-6.453 2.38-1.476 1.485-2.237 3.618-2.262 6.34.025 2.718.786 4.851 2.262 6.341 1.547 1.561 3.719 2.363 6.453 2.38h.007c2.496-.015 4.404-.544 5.872-1.615 1.589-1.155 2.395-2.885 2.395-5.14 0-.665-.074-1.28-.223-1.832-.302-1.127-.854-1.992-1.642-2.574-.786-.58-1.811-.879-3.052-.892-1.163.013-2.117.332-2.835.949z" />
        </svg>
      ),
    },
  ];

  const marqueeRow2 = [
    "Adobe",
    "Airtable",
    "Amazon",
    "ByteDance",
    "Chase",
    "Cloudflare",
    "GoDaddy",
    "Heroku",
    "BMW",
    "Notion",
    "Stripe",
    "Vercel",
    "Buildkite",
    "Burton",
    "Couchbase",
  ];

  const keyframesCSS = `
    @keyframes marqFwd { from { transform: translateX(0) } to { transform: translateX(-50%) } }
    @keyframes marqRev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
  `;

  return (
    <>
      <style>{keyframesCSS}</style>

      {/* ─── HERO ─── */}
      <section
        style={{
          minHeight: "100vh",
          background: "#fafafa",
          backgroundImage:
            "radial-gradient(circle, #d0d0d0 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "110px 24px 0",
          position: "relative",
          fontFamily: "'DM Sans', 'Inter', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Dot fade overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 60% 35% at 50% 0%, #fafafa 0%, transparent 100%), radial-gradient(ellipse 40% 100% at 0% 50%, #fafafa 0%, transparent 100%), radial-gradient(ellipse 40% 100% at 100% 50%, #fafafa 0%, transparent 100%)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "860px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* ── Badge ── */}
          <div
            onMouseEnter={badgeHover}
            onMouseLeave={badgeLeave}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#fff",
              border: "2px solid #000",
              boxShadow: "3px 3px 0 #000",
              borderRadius: "999px",
              padding: "6px 16px 6px 6px",
              fontSize: ".8rem",
              fontWeight: 600,
              marginBottom: "28px",
              cursor: "default",
              transition: "transform .15s, box-shadow .15s",
            }}
          >
            <span
              style={{
                background: "#ff4444",
                color: "#fff",
                borderRadius: "999px",
                padding: "3px 10px",
                fontSize: ".7rem",
                letterSpacing: ".06em",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              NEW
            </span>
            <span>Now with AI-powered scheduling ↗</span>
          </div>

          {/* ── Headline ── */}
          <h1
            style={{
              fontSize: "clamp(2.8rem, 6vw, 4.4rem)",
              fontWeight: 800,
              lineHeight: 1.07,
              letterSpacing: "-.04em",
              color: "#0a0a0a",
              marginBottom: "22px",
            }}
          >
            The easiest way to
            <br />
            scale your socials
          </h1>

          {/* ── Subheading ── */}
          <p
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.125rem)",
              fontWeight: 400,
              color: "#555",
              lineHeight: 1.65,
              maxWidth: "580px",
              marginBottom: "40px",
            }}
          >
            Manage all your social accounts from one dashboard. Schedule, draft
            &amp; publish — without switching tabs.
          </p>

          {/* ── CTA Buttons ── */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "56px",
            }}
          >
            <a
              href="/login"
              onMouseEnter={btnHover}
              onMouseLeave={btnLeave}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#5945FE",
                color: "#fff",
                border: "2px solid #000",
                boxShadow: "4px 4px 0 #000",
                padding: "15px 36px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                textDecoration: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "transform .12s, box-shadow .12s",
              }}
            >
              Try it free →
            </a>
            <a
              href="/demo"
              onMouseEnter={btnHover}
              onMouseLeave={btnLeave}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#fff",
                color: "#0a0a0a",
                border: "2px solid #000",
                boxShadow: "4px 4px 0 #000",
                padding: "15px 28px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "transform .12s, box-shadow .12s",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Watch demo
            </a>
          </div>

          {/* ── Social Icons ── */}
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 600,
              color: "#aaa",
              letterSpacing: ".09em",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            Post everywhere at once
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "56px",
            }}
          >
            {socialPlatforms.map((p) => (
              <div
                key={p.name}
                title={p.name}
                onMouseEnter={chipHover}
                onMouseLeave={chipLeave}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  background: "#fff",
                  border: "2px solid #e0e0e0",
                  borderRadius: "13px",
                  boxShadow: "2px 2px 0 #ddd",
                  cursor: "pointer",
                  transition:
                    "transform .13s, box-shadow .13s, border-color .13s",
                }}
              >
                {p.icon}
              </div>
            ))}
          </div>

          {/* ── Browser Mockup ── */}
          <div
            style={{
              width: "100%",
              maxWidth: "860px",
              border: "2px solid #0a0a0a",
              borderBottom: "none",
              borderRadius: "12px 12px 0 0",
              overflow: "hidden",
              boxShadow: "6px 6px 0 #0a0a0a",
            }}
          >
            {/* Title bar */}
            <div
              style={{
                background: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                gap: "12px",
                borderBottom: "1px solid #333",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#ff5f57",
                  }}
                />
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#ffbd2e",
                  }}
                />
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#28c840",
                  }}
                />
              </div>
              <div
                style={{ flex: 1, display: "flex", justifyContent: "center" }}
              >
                <div
                  style={{
                    background: "#2a2a2a",
                    color: "#ccc",
                    fontSize: ".78rem",
                    fontFamily: "'DM Sans', sans-serif",
                    padding: "5px 20px",
                    borderRadius: "6px",
                  }}
                >
                  your-website.com
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#888"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Browser body */}
            <div
              style={{
                display: "flex",
                background: "#f5f5f5",
                minHeight: "200px",
              }}
            >
              {/* Sidebar */}
              <div
                style={{
                  width: "160px",
                  flexShrink: 0,
                  background: "#fff",
                  borderRight: "1px solid #e8e8e8",
                  padding: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      background: "#0a0a0a",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                </div>
                {[
                  {
                    label: "Messages",
                    active: true,
                    icon: (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    ),
                  },
                  {
                    label: "Tasks",
                    active: false,
                    icon: (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ),
                  },
                  {
                    label: "Board",
                    active: false,
                    icon: (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                    ),
                  },
                  {
                    label: "Calendar",
                    active: false,
                    icon: (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
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
                    label: "Analytics",
                    active: false,
                    icon: (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "7px 8px",
                      borderRadius: "6px",
                      fontSize: ".78rem",
                      color: item.active ? "#5945FE" : "#555",
                      background: item.active ? "#f0eeff" : "transparent",
                      cursor: "pointer",
                      marginBottom: "2px",
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div style={{ flex: 1, padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "9px 14px",
                      fontSize: ".82rem",
                      color: "#aaa",
                      width: "220px",
                    }}
                  >
                    Search...
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#aaa"
                      strokeWidth="2"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#aaa"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "10px",
                  }}
                >
                  {[false, true, false].map((highlighted, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fff",
                        border: highlighted
                          ? "1px solid #e8e8e8"
                          : "1px dashed #ddd",
                        borderRadius: "8px",
                        padding: "10px",
                        minHeight: "70px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: highlighted ? "40%" : "50%",
                          height: "6px",
                          background: highlighted ? "#d4cfff" : "#eee",
                          borderRadius: "3px",
                        }}
                      />
                      <div
                        style={{
                          width: "75%",
                          height: "6px",
                          background: "#eee",
                          borderRadius: "3px",
                        }}
                      />
                      <div
                        style={{
                          width: "55%",
                          height: "6px",
                          background: "#eee",
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ROW 1 — Social Platforms (forward) ─── */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          borderTop: "2px solid #0a0a0a",
          borderBottom: "2px solid #0a0a0a",
          background: "#fff",
          padding: "16px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "50px",
            whiteSpace: "nowrap",
            width: "max-content",
            animation: "marqFwd 24s linear infinite",
          }}
        >
          {[...marqueeRow1, ...marqueeRow1].map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: ".9rem",
                letterSpacing: ".04em",
                color: "#0a0a0a",
                textTransform: "uppercase",
                opacity: 0.65,
              }}
            >
              {item.icon}
              {item.label}
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#5945FE",
                  display: "inline-block",
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ─── MARQUEE ROW 2 — Companies (reverse) ─── */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          borderBottom: "2px solid #0a0a0a",
          background: "#fff",
          padding: "16px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "50px",
            whiteSpace: "nowrap",
            width: "max-content",
            animation: "marqRev 24s linear infinite",
          }}
        >
          {[...marqueeRow2, ...marqueeRow2].map((name, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: ".9rem",
                letterSpacing: ".04em",
                color: "#0a0a0a",
                textTransform: "uppercase",
                opacity: 0.65,
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#5945FE",
                  display: "inline-block",
                }}
              />
              {name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};
