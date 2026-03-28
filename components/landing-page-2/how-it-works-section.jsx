export const HowItWorksSection = () => {
  const steps = [
    {
      num: "01",
      tag: "One-time setup",
      title: "Connect your LinkedIn profile",
      body: (
        <>
          We analyze your <strong>last 20–50 posts</strong> — sentence
          structure, how you open, what hooks you use, how you close. We build a
          private "voice fingerprint" that lives only in your account.
        </>
      ),
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      num: "02",
      tag: "Daily — 30 sec",
      title: "Drop in a topic or rough thought",
      body: (
        <>
          Tell us what you want to post about. Could be{" "}
          <strong>"fundraising rejection I got this week"</strong> or{" "}
          <strong>"why cold DMs don't work anymore."</strong> One sentence is
          enough. We do the rest.
        </>
      ),
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      num: "03",
      tag: "Takes 3 minutes",
      title: "Get a post that sounds like you at 11pm on a Tuesday",
      body: (
        <>
          We generate a full post using your voice fingerprint — your{" "}
          <strong>quirks, cadence, and hook style.</strong> Review it, make a
          tweak or two, and post. Done.
        </>
      ),
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      num: "04",
      tag: "Compounding returns",
      title: "It gets better the more you use it",
      body: (
        <>
          Every edit or approval teaches draftfor.me your preferences. Over time
          it needs <strong>less and less intervention</strong> — some users post
          in under 2 minutes.
        </>
      ),
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  return (
    <section className="hiw-section" id="how-it-works">
      <style jsx>{`
        /* ── Shell ── */
        .hiw-section {
          padding: 140px 24px 120px;
          background: var(--ink, #0f0f0f);
          position: relative;
          overflow: hidden;
        }

        /* ── SVG isometric grid ── */
        .hiw-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* ── top & bottom fade-out overlays ── */
        .hiw-fade-top,
        .hiw-fade-bottom {
          position: absolute;
          left: 0;
          right: 0;
          height: 160px;
          pointer-events: none;
          z-index: 1;
        }
        .hiw-fade-top {
          top: 0;
          background: linear-gradient(
            to bottom,
            var(--ink, #0f0f0f) 0%,
            transparent 100%
          );
        }
        .hiw-fade-bottom {
          bottom: 0;
          background: linear-gradient(
            to top,
            var(--ink, #0f0f0f) 0%,
            transparent 100%
          );
        }

        /* ── Blue glow ── */
        .hiw-glow {
          position: absolute;
          width: 800px;
          height: 600px;
          top: -180px;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(
            ellipse,
            rgba(10, 102, 194, 0.16) 0%,
            transparent 62%
          );
          filter: blur(40px);
          pointer-events: none;
          z-index: 0;
        }
        .hiw-glow-bottom {
          position: absolute;
          width: 500px;
          height: 400px;
          bottom: -100px;
          right: -80px;
          background: radial-gradient(
            ellipse,
            rgba(232, 82, 26, 0.1) 0%,
            transparent 65%
          );
          filter: blur(50px);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Inner content ── */
        .hiw-inner {
          position: relative;
          z-index: 2;
          max-width: 720px;
          margin: 0 auto;
        }

        /* ── Eyebrow ── */
        .hiw-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(10, 102, 194, 0.85);
          margin-bottom: 18px;
        }
        .hiw-eyebrow-line {
          width: 28px;
          height: 1px;
          background: rgba(10, 102, 194, 0.35);
        }

        /* ── Title ── */
        .hiw-title {
          font-family: var(--font-instrument, Georgia, serif);
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 80px;
        }
        .hiw-title em {
          font-style: italic;
          color: var(--accent, #e8521a);
        }

        /* ── Steps container ── */
        .steps {
          display: flex;
          flex-direction: column;
        }

        /* ── Single step ── */
        .step {
          display: grid;
          grid-template-columns: 68px 1fr;
          gap: 28px;
          padding: 36px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
          cursor: default;
        }
        .step:last-child {
          border-bottom: none;
        }

        /* dashed connector thread between steps */
        .step:not(:last-child)::after {
          content: "";
          position: absolute;
          left: 33px;
          top: calc(68px + 36px);
          height: calc(100% - 68px - 36px + 36px);
          width: 2px;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.1) 0px,
            rgba(255, 255, 255, 0.1) 4px,
            transparent 4px,
            transparent 9px
          );
        }

        /* ── Number + icon column ── */
        .step-aside {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding-top: 4px;
        }

        /* number bubble */
        .step-bubble {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
          flex-shrink: 0;
          transition:
            border-color 0.3s,
            background 0.3s,
            box-shadow 0.3s;
          backdrop-filter: blur(6px);
        }
        .step:hover .step-bubble {
          border-color: var(--accent, #e8521a);
          background: rgba(232, 82, 26, 0.07);
          box-shadow: 0 0 24px rgba(232, 82, 26, 0.18);
        }
        .step-bubble-num {
          font-family: var(--font-instrument, Georgia, serif);
          font-size: 0.72rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.3);
          line-height: 1;
          transition: color 0.3s;
        }
        .step:hover .step-bubble-num {
          color: var(--accent, #e8521a);
        }
        .step-bubble-icon {
          color: rgba(255, 255, 255, 0.35);
          transition: color 0.3s;
          display: flex;
        }
        .step:hover .step-bubble-icon {
          color: var(--accent, #e8521a);
        }

        /* ── Step body ── */
        .step-content {
          padding-top: 8px;
        }

        .step-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.67rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: rgba(10, 102, 194, 0.8);
          background: rgba(10, 102, 194, 0.1);
          border: 1px solid rgba(10, 102, 194, 0.18);
          padding: 3px 10px;
          border-radius: 100px;
          margin-bottom: 12px;
        }
        .step-tag-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(10, 102, 194, 0.7);
        }

        .step-content h3 {
          font-family: var(--font-instrument, Georgia, serif);
          font-size: 1.18rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: rgba(255, 255, 255, 0.92);
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .step-content p {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.42);
          line-height: 1.78;
          max-width: 520px;
        }
        .step-content p strong {
          color: rgba(255, 255, 255, 0.78);
          font-weight: 500;
        }

        /* ── Bottom strip ── */
        .hiw-footer {
          margin-top: 64px;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .hiw-footer-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.35);
          line-height: 1.6;
        }
        .hiw-footer-text strong {
          color: rgba(255, 255, 255, 0.72);
          font-weight: 500;
        }
        .hiw-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--accent, #e8521a);
          color: #fff;
          padding: 13px 28px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: -0.01em;
          white-space: nowrap;
          flex-shrink: 0;
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }
        .hiw-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(232, 82, 26, 0.38);
        }

        @media (max-width: 768px) {
          .step {
            grid-template-columns: 52px 1fr;
            gap: 18px;
          }
          .step-bubble {
            width: 46px;
            height: 46px;
            border-radius: 12px;
          }
          .hiw-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      {/* ── Isometric dot-grid SVG ── */}
      <svg
        className="hiw-bg"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* tiny dots in a 32×32 isometric grid */}
          <pattern
            id="hiw-dots"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(30)"
          >
            <circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.07)" />
            <circle cx="16" cy="16" r="1" fill="rgba(255,255,255,0.07)" />
          </pattern>
          {/* radial fade — dots visible on edges only */}
          <radialGradient id="hiw-dot-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="black" stopOpacity="0" />
            <stop offset="50%" stopColor="black" stopOpacity="0.5" />
            <stop offset="100%" stopColor="black" stopOpacity="1" />
          </radialGradient>
          <mask id="hiw-dot-mask">
            <rect width="100%" height="100%" fill="url(#hiw-dot-fade)" />
          </mask>
          {/* horizontal scan-line texture */}
          <pattern
            id="hiw-lines"
            x="0"
            y="0"
            width="1"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <rect y="0" width="1" height="1" fill="rgba(255,255,255,0.015)" />
          </pattern>
        </defs>
        {/* scan lines across entire section */}
        <rect width="100%" height="100%" fill="url(#hiw-lines)" />
        {/* dot grid masked to edges */}
        <rect
          width="100%"
          height="100%"
          fill="url(#hiw-dots)"
          mask="url(#hiw-dot-mask)"
        />
        {/* large decorative arcs in top-left */}
        <circle
          cx="0"
          cy="0"
          r="380"
          fill="none"
          stroke="rgba(10,102,194,0.07)"
          strokeWidth="1"
        />
        <circle
          cx="0"
          cy="0"
          r="560"
          fill="none"
          stroke="rgba(10,102,194,0.04)"
          strokeWidth="1"
        />
        {/* bottom-right accent arc */}
        <circle
          cx="100%"
          cy="100%"
          r="300"
          fill="none"
          stroke="rgba(232,82,26,0.06)"
          strokeWidth="1"
        />
        {/* subtle diagonal rule */}
        <line
          x1="0"
          y1="100%"
          x2="40%"
          y2="0"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
        />
      </svg>

      <div className="hiw-fade-top" aria-hidden="true" />
      <div className="hiw-fade-bottom" aria-hidden="true" />
      <div className="hiw-glow" aria-hidden="true" />
      <div className="hiw-glow-bottom" aria-hidden="true" />

      <div className="hiw-inner">
        <p className="hiw-eyebrow">
          <span className="hiw-eyebrow-line" />
          Dead simple
          <span className="hiw-eyebrow-line" />
        </p>
        <h2 className="hiw-title">
          From zero to <em>authentic post</em>
          <br />
          in 4 minutes.
        </h2>

        <div className="steps">
          {steps.map(({ num, tag, title, body, icon }) => (
            <div className="step reveal" key={num}>
              <div className="step-aside">
                <div className="step-bubble">
                  <span className="step-bubble-num">{num}</span>
                  <span className="step-bubble-icon">{icon}</span>
                </div>
              </div>
              <div className="step-content">
                <div className="step-tag">
                  <span className="step-tag-dot" />
                  {tag}
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hiw-footer">
          <p className="hiw-footer-text">
            <strong>No credit card.</strong> No LinkedIn password.
            <br />
            Works in 60 seconds.
          </p>
          <a href="#" className="hiw-cta">
            Start for free
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
