export const VsSection = () => {
  const themItems = [
    "Sounds like AI, not you",
    "Same bland tone for every user",
    "You prompt → it guesses your style",
    "Triggers LinkedIn's AI-detection filters",
    "No memory of your past posts",
    '"I\'m excited to share…" every time',
    "You still spend 30+ min editing",
  ];
  const usItems = [
    "Trained exclusively on YOUR posts",
    "Learns your vocabulary, rhythm & humor",
    "Full voice analysis in 60 seconds",
    'Passes the "did a human write this?" test',
    "Gets sharper with every draft",
    "Mirrors your unique hooks & quirks",
    "Ready in 4 minutes — ship it",
  ];

  return (
    <section className="vs-section">
      <style jsx>{`
        /* ── Shell ── */
        .vs-section {
          padding: 140px 24px 120px;
          position: relative;
          overflow: hidden;
          background: #f7f4ef;
        }

        /* ── SVG cross-hatch texture (inline, positioned absolutely) ── */
        .vs-texture {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 1;
        }

        /* ── Accent blob top-left ── */
        .vs-blob {
          position: absolute;
          pointer-events: none;
          z-index: 0;
          border-radius: 50%;
          filter: blur(70px);
        }
        .vs-blob-1 {
          width: 560px;
          height: 420px;
          top: -100px;
          left: -80px;
          background: radial-gradient(
            ellipse,
            rgba(10, 102, 194, 0.09) 0%,
            transparent 70%
          );
        }
        .vs-blob-2 {
          width: 440px;
          height: 360px;
          bottom: -80px;
          right: -60px;
          background: radial-gradient(
            ellipse,
            rgba(232, 82, 26, 0.08) 0%,
            transparent 70%
          );
        }

        /* ── Header ── */
        .vs-header-block {
          text-align: center;
          position: relative;
          z-index: 1;
          margin-bottom: 80px;
        }
        .vs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent, #e8521a);
          margin-bottom: 18px;
        }
        .vs-eyebrow-line {
          width: 32px;
          height: 1px;
          background: var(--accent, #e8521a);
          opacity: 0.45;
        }
        .vs-title {
          font-family: var(--font-instrument, Georgia, serif);
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--ink, #0f0f0f);
        }
        .vs-title em {
          font-style: italic;
          color: var(--blue, #0a66c2);
        }

        /* ── Grid ── */
        .vs-grid {
          display: grid;
          grid-template-columns: 1fr 56px 1fr;
          align-items: start;
          max-width: 920px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* ── Columns ── */
        .vs-col {
          border-radius: 20px;
          overflow: hidden;
          border: 1.5px solid;
          position: relative;
        }
        .vs-col.them {
          border-color: #e2ddd7;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(10px);
        }
        .vs-col.us {
          border-color: var(--ink, #0f0f0f);
          background: var(--ink, #0f0f0f);
          transform: scale(1.03) translateY(-6px);
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.14),
            0 32px 64px rgba(0, 0, 0, 0.12),
            inset 0 0 0 1px rgba(255, 255, 255, 0.06);
        }
        /* faint inner shimmer on "us" card */
        .vs-col.us::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 180px;
          background: radial-gradient(
            ellipse 80% 60% at 50% 0%,
            rgba(10, 102, 194, 0.14) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
        }

        /* ── Column header ── */
        .col-header {
          padding: 20px 26px 18px;
          border-bottom: 1.5px solid;
          display: flex;
          align-items: center;
          gap: 11px;
          position: relative;
          z-index: 1;
        }
        .vs-col.them .col-header {
          background: #f4f1ec;
          border-color: #e2ddd7;
        }
        .vs-col.us .col-header {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.08);
        }
        .col-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .vs-col.them .col-icon {
          background: #ebe7e1;
        }
        .vs-col.us .col-icon {
          background: rgba(255, 255, 255, 0.08);
        }
        .col-title {
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .vs-col.them .col-title {
          color: #b0a89e;
        }
        .vs-col.us .col-title {
          color: rgba(255, 255, 255, 0.85);
        }

        /* thin top accent bar on "us" card */
        .vs-col.us .col-header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            rgba(10, 102, 194, 0.6) 0%,
            var(--accent, #e8521a) 60%,
            transparent 100%
          );
        }

        /* ── Items ── */
        .vs-item {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 14px 26px;
          border-bottom: 1px solid;
          font-size: 0.875rem;
          line-height: 1.5;
          transition: background 0.15s;
          position: relative;
          z-index: 1;
        }
        .vs-item:last-child {
          border-bottom: none;
        }
        .vs-col.them .vs-item {
          border-color: #ede9e3;
          color: #a09890;
        }
        .vs-col.them .vs-item:hover {
          background: rgba(255, 255, 255, 0.6);
        }
        .vs-col.us .vs-item {
          border-color: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.75);
        }
        .vs-col.us .vs-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .icon-wrap {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          font-size: 0.68rem;
          font-weight: 900;
        }
        .vs-col.them .icon-wrap {
          background: #fee2e2;
          color: #ef4444;
        }
        .vs-col.us .icon-wrap {
          background: rgba(34, 197, 94, 0.18);
          color: #4ade80;
        }

        /* ── VS divider ── */
        .vs-divider {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 140px;
          gap: 6px;
        }
        .vs-divider-line {
          width: 1px;
          height: 56px;
          background: repeating-linear-gradient(
            to bottom,
            #ccc8c2 0px,
            #ccc8c2 4px,
            transparent 4px,
            transparent 9px
          );
        }
        .vs-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f7f4ef;
          border: 2px solid #ddd8d2;
          color: var(--ink, #0f0f0f);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.74rem;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          z-index: 2;
        }

        /* ── Footer ── */
        .vs-footer {
          text-align: center;
          margin-top: 60px;
          position: relative;
          z-index: 1;
        }
        .vs-footer-text {
          font-size: 0.85rem;
          color: #9a9086;
        }
        .vs-footer-text strong {
          color: var(--ink, #0f0f0f);
          font-weight: 600;
        }
        .vs-footer-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          background: var(--ink, #0f0f0f);
          color: #fafaf8;
          padding: 13px 30px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition:
            background 0.2s,
            transform 0.2s,
            box-shadow 0.2s;
        }
        .vs-footer-link:hover {
          background: var(--accent, #e8521a);
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(232, 82, 26, 0.28);
        }

        @media (max-width: 768px) {
          .vs-grid {
            grid-template-columns: 1fr;
          }
          .vs-divider {
            display: none;
          }
          .vs-col.us {
            transform: none;
          }
        }
      `}</style>

      {/* SVG cross-hatch texture */}
      <svg
        className="vs-texture"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="vs-hatch"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(30)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="20"
              stroke="rgba(10,10,10,0.04)"
              strokeWidth="1"
            />
          </pattern>
          {/* mask: only show on edges, clear in center */}
          <radialGradient id="vs-hatch-mask-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="black" stopOpacity="0" />
            <stop offset="60%" stopColor="black" stopOpacity="0.4" />
            <stop offset="100%" stopColor="black" stopOpacity="1" />
          </radialGradient>
          <mask id="vs-hatch-mask">
            <rect width="100%" height="100%" fill="url(#vs-hatch-mask-grad)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#vs-hatch)"
          mask="url(#vs-hatch-mask)"
        />
        {/* large decorative arcs */}
        <circle
          cx="0"
          cy="0"
          r="320"
          fill="none"
          stroke="rgba(10,102,194,0.06)"
          strokeWidth="1"
        />
        <circle
          cx="0"
          cy="0"
          r="480"
          fill="none"
          stroke="rgba(10,102,194,0.04)"
          strokeWidth="1"
        />
        <circle
          cx="100%"
          cy="100%"
          r="280"
          fill="none"
          stroke="rgba(232,82,26,0.06)"
          strokeWidth="1"
        />
        <circle
          cx="100%"
          cy="100%"
          r="420"
          fill="none"
          stroke="rgba(232,82,26,0.04)"
          strokeWidth="1"
        />
      </svg>

      <div className="vs-blob vs-blob-1" aria-hidden="true" />
      <div className="vs-blob vs-blob-2" aria-hidden="true" />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="vs-header-block">
          <p className="vs-eyebrow">
            <span className="vs-eyebrow-line" />
            The difference is obvious
            <span className="vs-eyebrow-line" />
          </p>
          <h2 className="vs-title">
            Generic AI tools vs. <em>SocialWing</em>
          </h2>
        </div>

        <div className="vs-grid">
          {/* THEM */}
          <div className="vs-col them">
            <div className="col-header">
              <div className="col-icon">🤖</div>
              <span className="col-title">ChatGPT / Generic AI</span>
            </div>
            {themItems.map((text, i) => (
              <div className="vs-item" key={i}>
                <span className="icon-wrap">✕</span>
                {text}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="vs-divider">
            <div className="vs-divider-line" />
            <div className="vs-badge">VS</div>
            <div className="vs-divider-line" />
          </div>

          {/* US */}
          <div className="vs-col us">
            <div className="col-header">
              <div className="col-icon" style={{ fontSize: "0.9rem" }}>
                ✦
              </div>
              <span className="col-title">SocialWing</span>
            </div>
            {usItems.map((text, i) => (
              <div className="vs-item" key={i}>
                <span className="icon-wrap">✓</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="vs-footer">
          <p className="vs-footer-text">
            <strong>Still copy-pasting into ChatGPT?</strong> There's a better
            way.
          </p>
          <a href="#" className="vs-footer-link">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm5 12H7v-.5c0-2.2 3.6-3.5 5-3.5s5 1.3 5 3.5V18z" />
            </svg>
            Try SocialWing free →
          </a>
        </div>
      </div>
    </section>
  );
};
