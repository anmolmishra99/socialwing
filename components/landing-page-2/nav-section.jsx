export const NavSection = () => (
  <nav>
    <style jsx>{`
      nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 48px;
        height: 64px;
        background: rgba(250, 250, 248, 0.88);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-bottom: 1px solid rgba(10, 10, 10, 0.07);
        transition: box-shadow 0.3s;
      }

      /* thin progress-line accent at very top */
      nav::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(
          90deg,
          var(--blue, #0a66c2) 0%,
          var(--accent, #e8521a) 55%,
          transparent 100%
        );
        opacity: 0.7;
      }

      /* ── Logo ── */
      .logo {
        font-family: var(--font-instrument, Georgia, serif);
        font-size: 1.45rem;
        color: var(--ink, #0f0f0f);
        text-decoration: none;
        letter-spacing: -0.03em;
        display: flex;
        align-items: center;
        gap: 0;
        position: relative;
      }
      .logo-main {
        font-weight: 600;
      }
      .logo-for {
        color: var(--accent, #e8521a);
        font-style: italic;
        font-weight: 700;
      }
      .logo-dot {
        display: inline-block;
        width: 5px;
        height: 5px;
        background: var(--blue, #0a66c2);
        border-radius: 50%;
        margin: 0 1px 6px;
        flex-shrink: 0;
      }

      /* ── Nav links ── */
      .nav-links {
        display: flex;
        gap: 4px;
        align-items: center;
      }
      .nav-links a {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--muted, #666);
        text-decoration: none;
        padding: 6px 14px;
        border-radius: 8px;
        transition:
          color 0.18s,
          background 0.18s;
        letter-spacing: -0.01em;
        position: relative;
      }
      .nav-links a:not(.nav-cta):hover {
        color: var(--ink, #0f0f0f);
        background: rgba(10, 10, 10, 0.05);
      }

      /* active dot indicator */
      .nav-links a.active::after {
        content: "";
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background: var(--accent, #e8521a);
        border-radius: 50%;
      }

      /* ── CTA button ── */
      .nav-cta {
        background: var(--ink, #0f0f0f) !important;
        color: var(--paper, #fafaf8) !important;
        padding: 9px 22px !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        font-size: 0.85rem !important;
        letter-spacing: -0.01em;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: 8px;
        transition:
          background 0.2s,
          transform 0.2s,
          box-shadow 0.2s !important;
        box-shadow:
          0 1px 3px rgba(0, 0, 0, 0.12),
          0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .nav-cta:hover {
        background: var(--accent, #e8521a) !important;
        color: #fff !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 20px rgba(232, 82, 26, 0.28) !important;
      }
      .cta-arrow {
        font-style: normal;
        transition: transform 0.2s;
        display: inline-block;
      }
      .nav-cta:hover .cta-arrow {
        transform: translateX(3px);
      }

      /* ── Badge pill on a nav link ── */
      .nav-badge {
        display: inline-flex;
        align-items: center;
        background: rgba(10, 102, 194, 0.1);
        color: var(--blue, #0a66c2);
        font-size: 0.65rem;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 100px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        margin-left: 5px;
        vertical-align: middle;
      }

      @media (max-width: 768px) {
        nav {
          padding: 0 20px;
        }
        .nav-links a:not(.nav-cta) {
          display: none;
        }
      }
    `}</style>

    {/* Logo */}
    <a href="#" className="logo">
      <span className="logo-main">draft</span>
      <span className="logo-for">for</span>
      <span className="logo-dot" />
      <span className="logo-main">me</span>
    </a>

    {/* Links */}
    <div className="nav-links">
      <a href="#how-it-works">How it works</a>
      <a href="#pricing">
        Pricing
        <span className="nav-badge">Free</span>
      </a>
      <a href="#faq">FAQ</a>
      <a href="#" className="nav-cta">
        Start Free <span className="cta-arrow">→</span>
      </a>
    </div>
  </nav>
);
