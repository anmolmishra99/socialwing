export const VsSection = () => (
  <section className="vs-section">
    <style jsx>{`
      .vs-section { padding: 100px 24px; }
      .vs-grid {
        display: grid; grid-template-columns: 1fr auto 1fr; gap: 32px;
        align-items: start; margin-top: 64px;
      }
      .vs-col {
        border-radius: 16px; overflow: hidden;
        border: 1.5px solid var(--border);
      }
      .vs-col.them { border-color: #e5e7eb; }
      .vs-col.us { border-color: var(--ink); }
      .vs-header {
        padding: 20px 28px;
        font-family: var(--font-syne);
        font-size: 0.8rem; font-weight: 700;
        letter-spacing: 0.08em; text-transform: uppercase;
        border-bottom: 1.5px solid var(--border);
      }
      .vs-col.them .vs-header {
        background: #f9fafb; color: #9ca3af;
        border-color: #e5e7eb;
      }
      .vs-col.us .vs-header {
        background: var(--ink); color: var(--paper);
        border-color: var(--ink);
      }
      .vs-item {
        display: flex; align-items: flex-start; gap: 14px;
        padding: 18px 28px;
        border-bottom: 1px solid;
        font-size: 0.9rem; line-height: 1.5;
      }
      .vs-col.them .vs-item { border-color: #f3f4f6; color: #6b7280; }
      .vs-col.us .vs-item { border-color: var(--border); color: var(--ink); }
      .vs-item:last-child { border-bottom: none; }
      .vs-icon { font-size: 1rem; flex-shrink: 0; margin-top: 2px; }
      .vs-divider {
        display: flex; align-items: center; justify-content: center;
        padding-top: 180px;
      }
      .vs-badge {
        width: 52px; height: 52px; border-radius: 50%;
        background: var(--ink); color: var(--paper);
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-syne); font-weight: 800;
        font-size: 0.85rem;
      }
      @media (max-width: 768px) {
        .vs-grid { grid-template-columns: 1fr; }
        .vs-divider { display: none; }
      }
    `}</style>
    <div className="container">
      <p className="section-tag accent">The difference is obvious</p>
      <h2 className="section-title">Generic AI tools vs. <em>draftfor.me</em></h2>

      <div className="vs-grid">
        <div className="vs-col them">
          <div className="vs-header">ChatGPT / Generic AI</div>
          <div className="vs-item"><span className="vs-icon">✗</span> Sounds like AI, not you</div>
          <div className="vs-item"><span className="vs-icon">✗</span> Same tone for every user</div>
          <div className="vs-item"><span className="vs-icon">✗</span> You prompt → it guesses your style</div>
          <div className="vs-item"><span className="vs-icon">✗</span> Triggers LinkedIn's AI-detection filters</div>
          <div className="vs-item"><span className="vs-icon">✗</span> No learning from your history</div>
          <div className="vs-item"><span className="vs-icon">✗</span> "I'm excited to share…" every time</div>
          <div className="vs-item"><span className="vs-icon">✗</span> You still spend 30+ min editing</div>
        </div>

        <div className="vs-divider">
          <div className="vs-badge">VS</div>
        </div>

        <div className="vs-col us">
          <div className="vs-header">draftfor.me</div>
          <div className="vs-item"><span className="vs-icon">✓</span> Trained on YOUR past posts</div>
          <div className="vs-item"><span className="vs-icon">✓</span> Learns your vocabulary, rhythm, humor</div>
          <div className="vs-item"><span className="vs-icon">✓</span> Style analysis in 60 seconds</div>
          <div className="vs-item"><span className="vs-icon">✓</span> Passes the "did a human write this?" test</div>
          <div className="vs-item"><span className="vs-icon">✓</span> Gets sharper with every post</div>
          <div className="vs-item"><span className="vs-icon">✓</span> Mirrors your unique hooks & quirks</div>
          <div className="vs-item"><span className="vs-icon">✓</span> Ready in 4 minutes, ship it</div>
        </div>
      </div>
    </div>
  </section>
);
