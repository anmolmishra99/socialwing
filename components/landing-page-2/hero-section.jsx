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
      }
      .hero::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(
            ellipse 60% 50% at 50% 0%,
            rgba(10, 102, 194, 0.08) 0%,
            transparent 70%
          ),
          radial-gradient(
            ellipse 40% 30% at 80% 80%,
            rgba(232, 82, 26, 0.06) 0%,
            transparent 60%
          );
        pointer-events: none;
      }
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--blue-light);
        border: 1px solid rgba(10, 102, 194, 0.2);
        color: var(--blue);
        font-size: 0.8rem;
        font-weight: 600;
        padding: 6px 16px;
        border-radius: 100px;
        margin-bottom: 32px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .hero-badge::before {
        content: "";
        width: 6px;
        height: 6px;
        background: var(--blue);
        border-radius: 50%;
        animation: pulse 1.5s ease infinite;
      }
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(0.7);
        }
      }
      h1 {
        font-family: var(--font-instrument);
        font-size: clamp(3rem, 7vw, 6rem);
        line-height: 1.05;
        letter-spacing: -0.03em;
        max-width: 900px;
        margin-bottom: 12px;
        animation: fadeUp 0.6s 0.1s ease both;
      }
      h1 em {
        font-style: italic;
        color: var(--accent);
      }
      .hero-sub {
        font-family: var(--font-instrument);
        font-size: clamp(1.2rem, 2.5vw, 1.6rem);
        color: var(--muted);
        font-style: italic;
        margin-bottom: 28px;
        animation: fadeUp 0.6s 0.15s ease both;
      }
      .hero-desc {
        font-size: 1.05rem;
        color: var(--muted);
        max-width: 560px;
        line-height: 1.7;
        margin-bottom: 44px;
        animation: fadeUp 0.6s 0.2s ease both;
      }
      .hero-desc strong {
        color: var(--ink);
        font-weight: 500;
      }
      .hero-actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 60px;
        animation: fadeUp 0.6s 0.25s ease both;
      }
      .btn-primary {
        background: var(--ink);
        color: var(--paper);
        border: none;
        cursor: pointer;
        padding: 16px 36px;
        border-radius: 8px;
        font-family: var(--font-dm-sans);
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        transition: all 0.25s;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .btn-primary:hover {
        background: var(--accent);
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(232, 82, 26, 0.25);
      }
      .btn-secondary {
        background: transparent;
        color: var(--ink);
        border: 1.5px solid var(--border);
        cursor: pointer;
        padding: 16px 28px;
        border-radius: 8px;
        font-family: var(--font-dm-sans);
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.2s;
        text-decoration: none;
      }
      .btn-secondary:hover {
        border-color: var(--ink);
        background: rgba(10, 10, 10, 0.03);
      }
      .hero-social-proof {
        display: flex;
        align-items: center;
        gap: 16px;
        animation: fadeUp 0.6s 0.3s ease both;
        flex-wrap: wrap;
        justify-content: center;
      }
      .avatars {
        display: flex;
      }
      .avatars img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid var(--cream);
        margin-left: -8px;
        object-fit: cover;
        background: var(--border);
      }
      .proof-text {
        font-size: 0.875rem;
        color: var(--muted);
      }
      .proof-text strong {
        color: var(--ink);
        font-weight: 600;
      }

      .linkedin-mock {
        background: #f3f2ef;
        border-radius: 20px;
        padding: 40px;
        max-width: 720px;
        margin: 60px auto 0;
        border: 1px solid #e0ddd8;
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.1);
      }
      .li-card {
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }
      .li-header {
        padding: 16px 20px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        border-bottom: 1px solid #e0ddd8;
      }
      .li-av {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #0a66c2;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1.1rem;
        flex-shrink: 0;
      }
      .li-name {
        font-weight: 600;
        font-size: 0.9rem;
        color: #1a1a1a;
      }
      .li-handle {
        font-size: 0.78rem;
        color: #666;
      }
      .li-body {
        padding: 20px;
        font-size: 0.9rem;
        line-height: 1.7;
        color: #1a1a1a;
        text-align: left;
      }
      .li-body p {
        margin-bottom: 12px;
      }
      .li-body .hashtag {
        color: #0a66c2;
      }
      .li-footer {
        padding: 12px 20px;
        border-top: 1px solid #e0ddd8;
        display: flex;
        gap: 24px;
        font-size: 0.78rem;
        color: #666;
      }
      .li-footer span {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .style-indicator {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--blue-light);
        border: 1px solid rgba(10, 102, 194, 0.2);
        color: var(--blue);
        padding: 6px 14px;
        border-radius: 100px;
        font-size: 0.78rem;
        font-weight: 600;
        margin-bottom: 24px;
      }
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>

    <div className="hero-badge">Your AI ghostwriter — trained on YOU</div>
    <h1>
      LinkedIn posts that
      <br />
      sound <em>exactly</em> like you.
    </h1>
    <p className="hero-sub pb-8 pt-5">
      Not like AI. Not like everyone else. Like <em>you</em>.
    </p>

    {/* <p className="hero-desc">
      Not like AI. Not like everyone else. <strong>Like you.</strong>
      <br />
      draftfor.me learns how you think, write, and express — then turns it into
      LinkedIn posts that sound unmistakably yours.
    </p> */}

    <div className="hero-actions">
      <a href="#" className="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm5 12H7v-.5c0-2.2 3.6-3.5 5-3.5s5 1.3 5 3.5V18z" />
        </svg>
        Analyze my LinkedIn voice
      </a>
      <a href="#how-it-works" className="btn-secondary">
        See how it works
      </a>
    </div>

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

    <div className="linkedin-mock reveal">
      <div className="style-indicator">
        Voice fingerprint detected — 94% match
      </div>
      <div className="li-card">
        <div className="li-header">
          <div className="li-av">SK</div>
          <div>
            <div className="li-name">Siddharth Kumar · CEO, SaaSify</div>
            <div className="li-handle">
              Founder | B2B SaaS | 12.4K followers
            </div>
          </div>
        </div>
        <div className="li-body">
          <p>
            I lost a $180K deal last year because I stopped posting on LinkedIn
            for 3 months.
          </p>
          <p>
            Not kidding. The prospect literally said: "I wasn't sure if you were
            still operating."
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
            <strong>draftfor.me</strong> — and it actually sounds like me, not a
            robot.
          </p>
          <p>Your audience can tell the difference. So can your pipeline.</p>
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
  </section>
);
