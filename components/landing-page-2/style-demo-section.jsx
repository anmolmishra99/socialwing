export const StyleDemoSection = () => (
  <section className="style-section">
    <style jsx>{`
      /* ── Shell ── */
      .style-section {
        padding: 130px 24px;
        background: #f5f0ea;
        position: relative;
        overflow: hidden;
      }

      /* ── Diagonal stripe watermark ── */
      .style-section::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(
          -45deg,
          rgba(10, 10, 10, 0.025) 0px,
          rgba(10, 10, 10, 0.025) 1px,
          transparent 1px,
          transparent 32px
        );
        pointer-events: none;
        z-index: 0;
      }

      /* warm blob top-right */
      .style-blob {
        position: absolute;
        width: 600px;
        height: 400px;
        top: -80px;
        right: -120px;
        background: radial-gradient(
          ellipse,
          rgba(232, 82, 26, 0.09) 0%,
          transparent 65%
        );
        filter: blur(60px);
        pointer-events: none;
        z-index: 0;
      }
      .style-blob-2 {
        position: absolute;
        width: 400px;
        height: 350px;
        bottom: -60px;
        left: -80px;
        background: radial-gradient(
          ellipse,
          rgba(124, 58, 237, 0.07) 0%,
          transparent 65%
        );
        filter: blur(50px);
        pointer-events: none;
        z-index: 0;
      }

      /* ── Content ── */
      .style-inner {
        position: relative;
        z-index: 1;
        max-width: 1000px;
        margin: 0 auto;
      }

      /* ── Header ── */
      .style-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--accent, #e8521a);
        margin-bottom: 16px;
      }
      .style-tag::before,
      .style-tag::after {
        content: "";
        width: 24px;
        height: 1px;
        background: var(--accent, #e8521a);
        opacity: 0.5;
      }
      .style-title {
        font-family: var(--font-instrument, Georgia, serif);
        font-size: clamp(2rem, 4vw, 3.2rem);
        line-height: 1.1;
        letter-spacing: -0.03em;
        color: var(--ink, #0f0f0f);
        margin-bottom: 64px;
      }
      .style-title em {
        font-style: italic;
        color: var(--accent, #e8521a);
      }

      /* ── Cards grid ── */
      .style-demo {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 28px;
      }

      /* ── Post card ── */
      .post-card {
        border-radius: 20px;
        padding: 32px;
        border: 1.5px solid rgba(10, 10, 10, 0.08);
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        position: relative;
        overflow: hidden;
        transition:
          transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
          box-shadow 0.3s;
      }
      .post-card:hover {
        transform: translateY(-6px) scale(1.01);
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.1);
      }

      /* colored top bar */
      .post-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
      }
      .post-card.blue::before {
        background: linear-gradient(90deg, #0a66c2, #3b9eff);
      }
      .post-card.purple::before {
        background: linear-gradient(90deg, #7c3aed, #a78bfa);
      }

      /* faint watermark initial */
      .post-card::after {
        content: attr(data-initials);
        position: absolute;
        bottom: -10px;
        right: 12px;
        font-family: var(--font-instrument, Georgia, serif);
        font-size: 6rem;
        font-weight: 700;
        font-style: italic;
        opacity: 0.04;
        line-height: 1;
        color: var(--ink, #0f0f0f);
        pointer-events: none;
        user-select: none;
      }

      /* ── Card label ── */
      .post-card-label {
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .label-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      /* ── Post meta ── */
      .post-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(10, 10, 10, 0.07);
      }
      .post-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
        flex-shrink: 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .post-meta-info {
        line-height: 1.3;
      }
      .post-author {
        font-weight: 600;
        font-size: 0.88rem;
        color: var(--ink, #0f0f0f);
      }
      .post-role {
        font-size: 0.75rem;
        color: var(--muted, #888);
        margin-top: 2px;
      }

      /* voice match badge */
      .voice-badge {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        padding: 3px 9px;
        border-radius: 100px;
        flex-shrink: 0;
      }
      .voice-badge-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
      }

      /* ── Post body ── */
      .post-body {
        font-size: 0.88rem;
        line-height: 1.78;
        color: var(--ink, #0f0f0f);
      }
      .post-body p {
        margin-bottom: 10px;
      }
      .post-body p:last-child {
        margin-bottom: 0;
      }
      .post-body strong {
        font-weight: 600;
      }

      /* ── Footer reactions ── */
      .post-reactions {
        margin-top: 20px;
        padding-top: 14px;
        border-top: 1px solid rgba(10, 10, 10, 0.07);
        display: flex;
        gap: 16px;
        font-size: 0.75rem;
        color: var(--muted, #888);
      }

      /* ── Bottom callout ── */
      .style-callout {
        margin-top: 48px;
        background: var(--ink, #0f0f0f);
        border-radius: 16px;
        padding: 28px 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
        position: relative;
        overflow: hidden;
      }
      .style-callout::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(
          ellipse 60% 80% at 0% 50%,
          rgba(10, 102, 194, 0.15) 0%,
          transparent 60%
        );
        pointer-events: none;
      }
      .callout-text {
        font-family: var(--font-instrument, Georgia, serif);
        font-size: 1.15rem;
        color: rgba(255, 255, 255, 0.9);
        font-style: italic;
        position: relative;
        z-index: 1;
      }
      .callout-text strong {
        font-style: normal;
        color: #fff;
      }
      .callout-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--accent, #e8521a);
        color: #fff;
        padding: 12px 24px;
        border-radius: 10px;
        font-size: 0.88rem;
        font-weight: 600;
        text-decoration: none;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
        position: relative;
        z-index: 1;
        white-space: nowrap;
      }
      .callout-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(232, 82, 26, 0.35);
      }

      @media (max-width: 768px) {
        .style-demo {
          grid-template-columns: 1fr;
        }
        .style-callout {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `}</style>

    {/* bg decorations */}
    <div className="style-blob" aria-hidden="true" />
    <div className="style-blob-2" aria-hidden="true" />

    <div className="style-inner">
      {/* Header */}
      <p className="style-tag">Voice-matching in action</p>
      <h2 className="style-title">
        Two users. Same topic.
        <br />
        <em>Completely different voices.</em>
      </h2>

      {/* Cards */}
      <div className="style-demo">
        {/* Card 1 — Blue / data-driven */}
        <div className="post-card blue reveal" data-initials="RK">
          <div className="post-card-label" style={{ color: "#0a66c2" }}>
            <span className="label-dot" style={{ background: "#0a66c2" }} />
            Direct & data-driven founder
          </div>
          <div className="post-meta">
            <div
              className="post-avatar"
              style={{ background: "#dbeafe", color: "#0a66c2" }}
            >
              RK
            </div>
            <div className="post-meta-info">
              <div className="post-author">Raghav K. · SaaS CEO</div>
              <div className="post-role">Revenue obsessed. Always hiring.</div>
            </div>
            <div
              className="voice-badge"
              style={{
                background: "rgba(10,102,194,0.1)",
                color: "#0a66c2",
                border: "1px solid rgba(10,102,194,0.18)",
              }}
            >
              <span
                className="voice-badge-dot"
                style={{ background: "#0a66c2" }}
              />
              97% match
            </div>
          </div>
          <div className="post-body">
            <p>3 things that killed our pipeline last quarter:</p>
            <p>
              1. Stopped posting → less inbound trust
              <br />
              2. Generic outreach → 0% reply rate
              <br />
              3. Chasing logos → wrong ICP
            </p>
            <p>Fixed all 3. Q3 is up 40% MoM.</p>
            <p>
              <strong>Consistency &gt; genius. Ship the post.</strong>
            </p>
          </div>
          <div className="post-reactions">
            <span>👍 312</span>
            <span>💬 44</span>
            <span>🔁 28</span>
          </div>
        </div>

        {/* Card 2 — Purple / storyteller */}
        <div className="post-card purple reveal" data-initials="PM">
          <div className="post-card-label" style={{ color: "#7c3aed" }}>
            <span className="label-dot" style={{ background: "#7c3aed" }} />
            Storyteller & community builder
          </div>
          <div className="post-meta">
            <div
              className="post-avatar"
              style={{ background: "#ede9fe", color: "#7c3aed" }}
            >
              PM
            </div>
            <div className="post-meta-info">
              <div className="post-author">Priya M. · Founder & Coach</div>
              <div className="post-role">Building in public. Caffeinated.</div>
            </div>
            <div
              className="voice-badge"
              style={{
                background: "rgba(124,58,237,0.09)",
                color: "#7c3aed",
                border: "1px solid rgba(124,58,237,0.18)",
              }}
            >
              <span
                className="voice-badge-dot"
                style={{ background: "#7c3aed" }}
              />
              94% match
            </div>
          </div>
          <div className="post-body">
            <p>I used to spend Sunday nights dreading Monday posts.</p>
            <p>
              Now I spend 4 minutes and it's done. And it actually sounds like
              me — the sarcastic, slightly-too-honest version of me that people
              actually follow.
            </p>
            <p>Turns out authenticity isn't just what you say.</p>
            <p>
              <strong>It's how you say it. Every. Single. Time.</strong>
            </p>
            <p>
              If you're still wrestling with the blank page, come talk to me. ✨
            </p>
          </div>
          <div className="post-reactions">
            <span>👍 189</span>
            <span>💬 37</span>
            <span>🔁 15</span>
          </div>
        </div>
      </div>

      {/* Bottom callout */}
      <div className="style-callout">
        <p className="callout-text">
          <strong>Your voice. Your quirks.</strong> Captured in 60 seconds.
        </p>
        <a href="#" className="callout-btn">
          Analyze my voice
          <svg
            width="16"
            height="16"
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
