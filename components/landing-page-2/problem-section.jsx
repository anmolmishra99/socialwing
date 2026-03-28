export const ProblemSection = () => (
  <section className="problem-section">
    <style jsx>{`
      .problem-section {
        background: var(--ink); color: var(--paper);
        padding: 100px 24px;
      }
      .problem-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
        margin-top: 64px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px; overflow: hidden;
      }
      .problem-card {
        padding: 40px 36px;
        background: rgba(255,255,255,0.03);
        position: relative;
        transition: background 0.3s;
      }
      .problem-card:hover { background: rgba(255,255,255,0.06); }
      .problem-card .num {
        font-family: var(--font-instrument);
        font-size: 3.5rem; color: rgba(255,255,255,0.08);
        font-style: italic;
        position: absolute; top: 20px; right: 28px;
        line-height: 1;
      }
      .problem-card h3 {
        font-family: var(--font-syne);
        font-size: 1.05rem; font-weight: 700;
        color: var(--paper); margin-bottom: 12px;
        line-height: 1.3;
      }
      .problem-card p {
        font-size: 0.9rem; line-height: 1.7;
        color: rgba(245,241,235,0.55);
      }
      .problem-card p strong { color: rgba(245,241,235,0.85); }
      @media (max-width: 768px) {
        .problem-grid { grid-template-columns: 1fr; }
      }
    `}</style>
    <div className="container">
      <p className="section-tag">The brutal truth</p>
      <h2 className="section-title">Why you're not posting — and <em>what it's costing you.</em></h2>

      <div className="problem-grid">
        <div className="problem-card">
          <span className="num">01</span>
          <h3>"I don't have time to write."</h3>
          <p>A typical LinkedIn post takes <strong>45–90 minutes</strong> to draft, edit, and agonize over. You're a founder, not a content machine. So you skip it — again.</p>
        </div>
        <div className="problem-card">
          <span className="num">02</span>
          <h3>"ChatGPT makes me sound like a robot."</h3>
          <p>Generic AI doesn't know you. It gives you <strong>buzzword soup</strong> — "I'm thrilled to announce," "synergy," "game-changing." Your audience scrolls past it instantly.</p>
        </div>
        <div className="problem-card">
          <span className="num">03</span>
          <h3>"I post once, then disappear for weeks."</h3>
          <p>LinkedIn's algorithm <strong>punishes inconsistency</strong>. Sporadic posting kills your reach. Your competitors who show up daily? They're winning deals you don't even know exist.</p>
        </div>
      </div>
    </div>
  </section>
);
