export const NavSection = () => (
  <nav>
    <style jsx>{`
      nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 100;
        display: flex; align-items: center; justify-content: space-between;
        padding: 18px 48px;
        background: rgba(245, 241, 235, 0.92);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border);
      }
      .logo {
        font-family: var(--font-instrument);
        font-size: 1.5rem;
        color: var(--ink);
        text-decoration: none;
        letter-spacing: -0.02em;
      }
      .logo span { color: var(--accent); }
      .nav-links { display: flex; gap: 32px; align-items: center; }
      .nav-links a {
        font-size: 0.875rem; font-weight: 500; color: var(--muted);
        text-decoration: none; transition: color 0.2s;
      }
      .nav-links a:hover { color: var(--ink); }
      .nav-cta {
        background: var(--ink); color: var(--paper) !important;
        padding: 10px 22px; border-radius: 6px;
        font-weight: 500 !important; font-size: 0.875rem !important;
        transition: background 0.2s !important;
      }
      .nav-cta:hover { background: var(--accent) !important; color: white !important; }
      @media (max-width: 768px) {
        nav { padding: 14px 20px; }
        .nav-links a:not(.nav-cta) { display: none; }
      }
    `}</style>
    <a href="#" className="logo">
      draft<span>for</span>.me
    </a>
    <div className="nav-links">
      <a href="#how-it-works">How it works</a>
      <a href="#pricing">Pricing</a>
      <a href="#faq">FAQ</a>
      <a href="#" className="nav-cta">
        Start Free →
      </a>
    </div>
  </nav>
);
