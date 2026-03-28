export const ClosingCtaSection = () => (
  <section className="cta-section">
    <style jsx>{`
      .cta-section {
        padding: 120px 24px; text-align: center;
        background: var(--paper); position: relative; overflow: hidden;
      }
      .cta-section::before {
        content: '';
        position: absolute; inset: 0;
        background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,82,26,0.07) 0%, transparent 70%);
      }
      .cta-eyebrow {
        font-family: var(--font-syne);
        font-size: 0.72rem; font-weight: 700;
        letter-spacing: 0.12em; text-transform: uppercase;
        color: var(--accent); margin-bottom: 24px;
      }
      .cta-title {
        font-family: var(--font-instrument);
        font-size: clamp(2.5rem, 5vw, 4.5rem);
        line-height: 1.1; letter-spacing: -0.03em;
        margin-bottom: 20px; position: relative;
      }
      .cta-title em { font-style: italic; color: var(--accent); }
      .cta-sub {
        font-size: 1.05rem; color: var(--muted);
        margin-bottom: 44px; line-height: 1.6;
      }
      .cta-actions {
        display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
        margin-bottom: 28px;
      }
      .cta-fine { font-size: 0.8rem; color: var(--muted); }
      .btn-primary {
        background: var(--ink); color: var(--paper);
        border: none; cursor: pointer;
        padding: 18px 44px; border-radius: 8px;
        font-family: var(--font-dm-sans);
        font-size: 1.1rem; font-weight: 600;
        letter-spacing: -0.01em;
        transition: all 0.25s;
        text-decoration: none;
        display: inline-flex; align-items: center; gap: 8px;
        z-index: 10; position: relative;
      }
      .btn-primary:hover {
        background: var(--accent); transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(232,82,26,0.25);
      }
    `}</style>
    <div style={{ position: "relative", zIndex: 1 }}>
      <p className="cta-eyebrow">The clock's ticking</p>
      <h2 className="cta-title">Your next deal is<br/><em>hiding in your feed.</em></h2>
      <p className="cta-sub">
        Every day you don't post is a day your competitor does.<br/>
        Your next client is scrolling LinkedIn right now — are they seeing you?
      </p>
      <div className="cta-actions">
        <a href="#" className="btn-primary">
          Analyze my LinkedIn voice — Free →
        </a>
      </div>
      <p className="cta-fine">No credit card · Takes 60 seconds · Cancel anytime</p>
    </div>
  </section>
);
