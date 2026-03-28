export const StatsSection = () => (
  <div className="stats-strip">
    <style jsx>{`
      .stats-strip {
        background: var(--accent); padding: 48px 24px;
      }
      .stats-inner {
        max-width: 900px; margin: 0 auto;
        display: grid; grid-template-columns: repeat(4, 1fr);
        gap: 32px; text-align: center;
      }
      .stat-num {
        font-family: var(--font-instrument);
        font-size: 2.8rem; color: white;
        font-style: italic; line-height: 1;
        margin-bottom: 6px;
      }
      .stat-label {
        font-size: 0.82rem; color: rgba(255,255,255,0.75);
        font-weight: 500;
      }
      @media (max-width: 768px) {
        .stats-inner { grid-template-columns: repeat(2, 1fr); }
      }
    `}</style>
    <div className="stats-inner">
      <div>
        <div className="stat-num">100+</div>
        <div className="stat-label">Active users</div>
      </div>
      <div>
        <div className="stat-num">94%</div>
        <div className="stat-label">Voice match accuracy</div>
      </div>
      <div>
        <div className="stat-num">4 min</div>
        <div className="stat-label">Avg. post time</div>
      </div>
      <div>
        <div className="stat-num">3.1×</div>
        <div className="stat-label">Avg. engagement lift</div>
      </div>
    </div>
  </div>
);
