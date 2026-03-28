export const HeroSection = () => (
  <section className="hero">
    <style jsx>{`
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 120px 24px 80px;
        position: relative;
        overflow: hidden;
        background: var(--paper, #fafaf8);
      }

      /* ── SVG dot-grid background ─────────────────────────────── */
      .hero-bg {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
      }

      /* ── Gradient blobs ──────────────────────────────────────── */
      .hero-blobs {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
      }
      .blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.55;
      }
      .blob-blue {
        width: 700px;
        height: 500px;
        top: -120px;
        left: 50%;
        transform: translateX(-50%);
        background: radial-gradient(
          ellipse,
          rgba(10, 102, 194, 0.12) 0%,
          transparent 70%
        );
        animation: blobDrift 10s ease-in-out infinite alternate;
      }
      .blob-orange {
        width: 420px;
        height: 360px;
        bottom: 60px;
        right: -80px;
        background: radial-gradient(
          ellipse,
          rgba(232, 82, 26, 0.1) 0%,
          transparent 70%
        );
        animation: blobDrift 13s ease-in-out infinite alternate-reverse;
      }
      .blob-teal {
        width: 300px;
        height: 280px;
        bottom: 100px;
        left: -60px;
        background: radial-gradient(
          ellipse,
          rgba(10, 194, 140, 0.07) 0%,
          transparent 70%
        );
        animation: blobDrift 11s ease-in-out infinite alternate;
      }
      @keyframes blobDrift {
        from {
          transform: translateY(0px) scale(1);
        }
        to {
          transform: translateY(30px) scale(1.06);
        }
      }

      /* ── Decorative SVG rings ────────────────────────────────── */
      .hero-rings {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
      }

      /* ── Content layer ───────────────────────────────────────── */
      .hero-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      /* ── Badge ───────────────────────────────────────────────── */
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--blue-light, rgba(10, 102, 194, 0.08));
        border: 1px solid rgba(10, 102, 194, 0.22);
        color: var(--blue, #0a66c2);
        font-size: 0.78rem;
        font-weight: 700;
        padding: 6px 18px;
        border-radius: 100px;
        margin-bottom: 32px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        box-shadow: 0 0 0 4px rgba(10, 102, 194, 0.06);
        animation: fadeUp 0.5s 0s ease both;
      }
      .hero-badge-dot {
        width: 6px;
        height: 6px;
        background: var(--blue, #0a66c2);
        border-radius: 50%;
        animation: pulse 1.5s ease infinite;
        flex-shrink: 0;
      }
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.4;
          transform: scale(0.65);
        }
      }

      /* ── Headline ────────────────────────────────────────────── */
      h1 {
        font-family: var(--font-instrument, Georgia, serif);
        font-size: clamp(3rem, 7vw, 6rem);
        line-height: 1.05;
        letter-spacing: -0.03em;
        max-width: 920px;
        margin-bottom: 14px;
        animation: fadeUp 0.6s 0.1s ease both;
        color: var(--ink, #0f0f0f);
      }
      h1 em {
        font-style: italic;
        color: var(--accent, #e8521a);
        position: relative;
      }
      /* underline squiggle on "exactly" */
      h1 em::after {
        content: "";
        position: absolute;
        bottom: -6px;
        left: 0;
        right: 0;
        height: 6px;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 12'%3E%3Cpath d='M0 8 Q12 2 24 8 Q36 14 48 8 Q60 2 72 8 Q84 14 96 8 L100 8' stroke='%23e8521a' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")
          repeat-x center / 60px 6px;
        opacity: 0.7;
      }

      .hero-sub {
        font-family: var(--font-instrument, Georgia, serif);
        font-size: clamp(1.2rem, 2.5vw, 1.6rem);
        color: var(--muted, #666);
        font-style: italic;
        margin-bottom: 44px;
        animation: fadeUp 0.6s 0.15s ease both;
      }

      /* ── CTA buttons ─────────────────────────────────────────── */
      .hero-actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 52px;
        animation: fadeUp 0.6s 0.2s ease both;
      }
      .btn-primary {
        background: var(--ink, #0f0f0f);
        color: var(--paper, #fafaf8);
        border: none;
        cursor: pointer;
        padding: 16px 36px;
        border-radius: 10px;
        font-family: var(--font-dm-sans, sans-serif);
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        position: relative;
        overflow: hidden;
      }
      .btn-primary::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.08) 0%,
          transparent 60%
        );
        opacity: 0;
        transition: opacity 0.2s;
      }
      .btn-primary:hover::before {
        opacity: 1;
      }
      .btn-primary:hover {
        background: var(--accent, #e8521a);
        transform: translateY(-3px) scale(1.02);
        box-shadow:
          0 16px 40px rgba(232, 82, 26, 0.3),
          0 4px 12px rgba(232, 82, 26, 0.15);
      }
      .btn-secondary {
        background: transparent;
        color: var(--ink, #0f0f0f);
        border: 1.5px solid var(--border, #e0ddd8);
        cursor: pointer;
        padding: 16px 28px;
        border-radius: 10px;
        font-family: var(--font-dm-sans, sans-serif);
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .btn-secondary:hover {
        border-color: var(--ink, #0f0f0f);
        background: rgba(10, 10, 10, 0.04);
        transform: translateY(-2px);
      }

      /* ── Social proof ────────────────────────────────────────── */
      .hero-social-proof {
        display: flex;
        align-items: center;
        gap: 16px;
        animation: fadeUp 0.6s 0.25s ease both;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 0;
      }
      .avatars {
        display: flex;
      }
      .avatars img {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 2px solid var(--paper, #fafaf8);
        margin-left: -10px;
        object-fit: cover;
        background: var(--border, #e0ddd8);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      .avatars img:first-child {
        margin-left: 0;
      }
      .proof-text {
        font-size: 0.875rem;
        color: var(--muted, #666);
      }
      .proof-text strong {
        color: var(--ink, #0f0f0f);
        font-weight: 600;
      }

      /* ── Stats strip ─────────────────────────────────────────── */
      .stats-strip {
        display: flex;
        gap: 40px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 48px 0 0;
        animation: fadeUp 0.6s 0.3s ease both;
      }
      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }
      .stat-value {
        font-family: var(--font-instrument, Georgia, serif);
        font-size: 1.7rem;
        font-weight: 700;
        color: var(--ink, #0f0f0f);
        letter-spacing: -0.03em;
      }
      .stat-label {
        font-size: 0.78rem;
        color: var(--muted, #888);
        letter-spacing: 0.04em;
        text-transform: uppercase;
        font-weight: 500;
      }
      .stat-divider {
        width: 1px;
        height: 40px;
        background: var(--border, #e0ddd8);
        align-self: center;
      }

      /* ── LinkedIn mock card ──────────────────────────────────── */
      .linkedin-mock-wrap {
        position: relative;
        max-width: 720px;
        width: 100%;
        margin: 68px auto 0;
        animation: fadeUp 0.7s 0.35s ease both;
      }
      /* decorative corner accents */
      .corner-accent {
        position: absolute;
        width: 48px;
        height: 48px;
        pointer-events: none;
      }
      .corner-accent.tl {
        top: -14px;
        left: -14px;
        border-top: 2px solid rgba(10, 102, 194, 0.25);
        border-left: 2px solid rgba(10, 102, 194, 0.25);
        border-radius: 4px 0 0 0;
      }
      .corner-accent.tr {
        top: -14px;
        right: -14px;
        border-top: 2px solid rgba(10, 102, 194, 0.25);
        border-right: 2px solid rgba(10, 102, 194, 0.25);
        border-radius: 0 4px 0 0;
      }
      .corner-accent.bl {
        bottom: -14px;
        left: -14px;
        border-bottom: 2px solid rgba(232, 82, 26, 0.2);
        border-left: 2px solid rgba(232, 82, 26, 0.2);
        border-radius: 0 0 0 4px;
      }
      .corner-accent.br {
        bottom: -14px;
        right: -14px;
        border-bottom: 2px solid rgba(232, 82, 26, 0.2);
        border-right: 2px solid rgba(232, 82, 26, 0.2);
        border-radius: 0 0 4px 0;
      }

      .linkedin-mock {
        background: #f3f2ef;
        border-radius: 20px;
        padding: 36px;
        border: 1px solid #e0ddd8;
        box-shadow:
          0 2px 4px rgba(0, 0, 0, 0.04),
          0 12px 32px rgba(0, 0, 0, 0.07),
          0 40px 80px rgba(0, 0, 0, 0.06);
      }
      .li-card {
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
        overflow: hidden;
      }
      .li-header {
        padding: 16px 20px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        border-bottom: 1px solid #e8e6e2;
      }
      .li-av {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0a66c2 0%, #0d4f9a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1.05rem;
        flex-shrink: 0;
        box-shadow: 0 3px 10px rgba(10, 102, 194, 0.3);
      }
      .li-meta {
        flex: 1;
      }
      .li-name {
        font-weight: 600;
        font-size: 0.9rem;
        color: #1a1a1a;
      }
      .li-handle {
        font-size: 0.78rem;
        color: #777;
        margin-top: 2px;
      }
      /* voice-match chip inside card header */
      .voice-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(10, 102, 194, 0.08);
        border: 1px solid rgba(10, 102, 194, 0.18);
        color: #0a66c2;
        padding: 4px 11px;
        border-radius: 100px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        flex-shrink: 0;
        align-self: center;
      }
      .voice-chip-dot {
        width: 5px;
        height: 5px;
        background: #0a66c2;
        border-radius: 50%;
        animation: pulse 1.4s ease infinite;
      }
      .li-body {
        padding: 20px 20px 16px;
        font-size: 0.9rem;
        line-height: 1.75;
        color: #1a1a1a;
        text-align: left;
      }
      .li-body p {
        margin-bottom: 12px;
      }
      .li-body p:last-child {
        margin-bottom: 0;
      }
      .li-body .hashtag {
        color: #0a66c2;
        font-weight: 500;
      }
      .li-body strong {
        font-weight: 600;
        color: #0f0f0f;
      }
      .li-footer {
        padding: 12px 20px;
        border-top: 1px solid #e8e6e2;
        display: flex;
        gap: 20px;
        font-size: 0.78rem;
        color: #777;
      }
      .li-footer span {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: color 0.15s;
      }
      .li-footer span:hover {
        color: #0a66c2;
      }

      /* ── Floating SVG sparkles ───────────────────────────────── */
      .sparkle {
        position: absolute;
        pointer-events: none;
        animation: sparkleFloat ease-in-out infinite;
        opacity: 0;
      }
      .sparkle-1 {
        top: 18%;
        left: 8%;
        animation-duration: 6s;
        animation-delay: 0s;
      }
      .sparkle-2 {
        top: 30%;
        right: 9%;
        animation-duration: 7.5s;
        animation-delay: 1.2s;
      }
      .sparkle-3 {
        top: 62%;
        left: 6%;
        animation-duration: 8s;
        animation-delay: 2.5s;
      }
      .sparkle-4 {
        top: 72%;
        right: 7%;
        animation-duration: 6.5s;
        animation-delay: 0.8s;
      }
      @keyframes sparkleFloat {
        0% {
          opacity: 0;
          transform: translateY(0px) rotate(0deg) scale(0.8);
        }
        20% {
          opacity: 0.6;
        }
        50% {
          opacity: 0.9;
          transform: translateY(-18px) rotate(20deg) scale(1);
        }
        80% {
          opacity: 0.5;
        }
        100% {
          opacity: 0;
          transform: translateY(-36px) rotate(40deg) scale(0.7);
        }
      }

      /* ── Shared animation ────────────────────────────────────── */
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(22px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>

    {/* ── SVG dot-grid background ─────────────────────────────── */}
    <svg
      className="hero-bg"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dot-grid"
          x="0"
          y="0"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="rgba(10,102,194,0.13)" />
        </pattern>
        {/* Fade mask so dots vanish toward center */}
        <radialGradient id="dot-fade" cx="50%" cy="50%" r="52%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="55%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="dot-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect width="100%" height="100%" fill="url(#dot-fade)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#dot-grid)"
        mask="url(#dot-mask)"
      />
    </svg>

    {/* ── Gradient blobs ───────────────────────────────────────── */}
    <div className="hero-blobs" aria-hidden="true">
      <div className="blob blob-blue" />
      <div className="blob blob-orange" />
      <div className="blob blob-teal" />
    </div>

    {/* ── Decorative concentric rings ──────────────────────────── */}
    <svg
      className="hero-rings"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="600"
        cy="-60"
        r="380"
        fill="none"
        stroke="rgba(10,102,194,0.06)"
        strokeWidth="1"
      />
      <circle
        cx="600"
        cy="-60"
        r="500"
        fill="none"
        stroke="rgba(10,102,194,0.04)"
        strokeWidth="1"
      />
      <circle
        cx="600"
        cy="-60"
        r="620"
        fill="none"
        stroke="rgba(10,102,194,0.03)"
        strokeWidth="1"
      />
      {/* bottom-right arc accent */}
      <circle
        cx="1120"
        cy="820"
        r="260"
        fill="none"
        stroke="rgba(232,82,26,0.07)"
        strokeWidth="1"
      />
      <circle
        cx="1120"
        cy="820"
        r="360"
        fill="none"
        stroke="rgba(232,82,26,0.04)"
        strokeWidth="1"
      />
      {/* subtle diagonal line cluster */}
      <line
        x1="0"
        y1="680"
        x2="280"
        y2="200"
        stroke="rgba(10,102,194,0.05)"
        strokeWidth="1"
      />
      <line
        x1="20"
        y1="680"
        x2="300"
        y2="200"
        stroke="rgba(10,102,194,0.03)"
        strokeWidth="1"
      />
      <line
        x1="1200"
        y1="120"
        x2="940"
        y2="700"
        stroke="rgba(232,82,26,0.04)"
        strokeWidth="1"
      />
      <line
        x1="1180"
        y1="120"
        x2="920"
        y2="700"
        stroke="rgba(232,82,26,0.03)"
        strokeWidth="1"
      />
    </svg>

    {/* ── Floating sparkles ────────────────────────────────────── */}
    {/* 4-point star SVG repeated */}
    {[
      { cls: "sparkle sparkle-1", color: "#0a66c2", size: 18 },
      { cls: "sparkle sparkle-2", color: "#e8521a", size: 14 },
      { cls: "sparkle sparkle-3", color: "#0a66c2", size: 12 },
      { cls: "sparkle sparkle-4", color: "#e8521a", size: 16 },
    ].map(({ cls, color, size }, i) => (
      <svg
        key={i}
        className={cls}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
          fill={color}
        />
      </svg>
    ))}

    {/* ── Main content ─────────────────────────────────────────── */}
    <div className="hero-content">
      <div className="hero-badge">
        <span className="hero-badge-dot" />
        Your AI ghostwriter — trained on YOU
      </div>

      <h1>
        LinkedIn posts that
        <br />
        sound <em>exactly</em> like you.
      </h1>

      <p
        className="hero-sub"
        style={{ paddingBottom: "8px", paddingTop: "6px" }}
      >
        Not like AI. Not like everyone else. Like <em>you</em>.
      </p>

      <div className="hero-actions">
        <a href="#" className="btn-primary">
          {/* LinkedIn icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm5 12H7v-.5c0-2.2 3.6-3.5 5-3.5s5 1.3 5 3.5V18z" />
          </svg>
          Analyze my LinkedIn voice
        </a>
        <a href="#how-it-works" className="btn-secondary">
          See how it works
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      {/* Social proof */}
      <div className="hero-social-proof">
        <div className="avatars">
          <img src="/assets/user/1.png" alt="User" />
          <img src="/assets/user/2.png" alt="User" />
          <img src="/assets/user/3.png" alt="User" />
          <img src="/assets/user/4.png" alt="User" />
        </div>
        <p className="proof-text">
          <strong>100+ founders & executives</strong> post daily with their
          authentic voice
        </p>
      </div>

      {/* Stats strip */}
      <div className="stats-strip">
        <div className="stat">
          <span className="stat-value">94%</span>
          <span className="stat-label">Voice match accuracy</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-value">4 min</span>
          <span className="stat-label">Avg. post time</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-value">3.2×</span>
          <span className="stat-label">Engagement lift</span>
        </div>
      </div>

      {/* LinkedIn mock card */}
      <div className="linkedin-mock-wrap reveal">
        {/* Corner accent lines */}
        <div className="corner-accent tl" />
        <div className="corner-accent tr" />
        <div className="corner-accent bl" />
        <div className="corner-accent br" />

        <div className="linkedin-mock">
          <div className="li-card">
            <div className="li-header">
              <div className="li-av">SK</div>
              <div className="li-meta">
                <div className="li-name">Siddharth Kumar · CEO, SaaSify</div>
                <div className="li-handle">
                  Founder | B2B SaaS | 12.4K followers
                </div>
              </div>
              <div className="voice-chip">
                <span className="voice-chip-dot" />
                94% match
              </div>
            </div>

            <div className="li-body">
              <p>
                I lost a $180K deal last year because I stopped posting on
                LinkedIn for 3 months.
              </p>
              <p>
                Not kidding. The prospect literally said: "I wasn't sure if you
                were still operating."
              </p>
              <p>
                Visibility IS credibility.
                <br />
                Silence IS risk.
                <br />
                Consistency IS a moat.
              </p>
              <p>
                Now I post every day. Takes me 4 minutes with{" "}
                <strong>draftfor.me</strong> — and it actually sounds like me,
                not a robot.
              </p>
              <p>
                Your audience can tell the difference. So can your pipeline.
              </p>
              <p>
                <span className="hashtag">#founders</span>{" "}
                <span className="hashtag">#linkedin</span>{" "}
                <span className="hashtag">#b2bsaas</span>
              </p>
            </div>

            <div className="li-footer">
              <span>👍 248 reactions</span>
              <span>💬 31 comments</span>
              <span>🔁 19 reposts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
