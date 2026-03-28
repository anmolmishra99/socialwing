export const FooterSection = () => (
  <footer>
    <style jsx>{`
      footer {
        background: var(--ink); color: rgba(245,241,235,0.4);
        padding: 48px 24px;
        display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 24px;
      }
      .footer-logo {
        font-family: var(--font-instrument);
        font-size: 1.3rem; color: var(--paper);
        text-decoration: none;
      }
      .footer-logo span { color: var(--accent); }
      .footer-links { display: flex; gap: 28px; flex-wrap: wrap; }
      .footer-links a {
        font-size: 0.82rem; color: rgba(245,241,235,0.4);
        text-decoration: none; transition: color 0.2s;
      }
      .footer-links a:hover { color: rgba(245,241,235,0.8); }
      @media (max-width: 768px) {
        footer { flex-direction: column; gap: 16px; }
      }
    `}</style>
    <a href="#" className="footer-logo">draft<span>for</span>.me</a>
    <div className="footer-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Blog</a>
      <a href="#">Contact</a>
      <a href="#">Twitter / X</a>
    </div>
    <p style={{fontSize: '0.78rem'}}>© 2025 draftfor.me · Made with obsession over voice.</p>
  </footer>
);
