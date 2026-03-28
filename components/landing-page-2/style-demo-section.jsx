export const StyleDemoSection = () => (
  <section className="style-section">
    <style jsx>{`
      .style-section { padding: 100px 24px; }
      .style-demo {
        margin-top: 64px;
        display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
      }
      .post-card {
        border-radius: 16px; padding: 32px;
        border: 1.5px solid var(--border);
        background: var(--card);
        position: relative; overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .post-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 60px rgba(0,0,0,0.08);
      }
      .post-card-label {
        font-family: var(--font-syne);
        font-size: 0.68rem; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase;
        margin-bottom: 16px;
        display: flex; align-items: center; gap: 8px;
      }
      .label-dot { width: 8px; height: 8px; border-radius: 50%; }
      .post-meta {
        display: flex; align-items: center; gap: 12px;
        margin-bottom: 16px;
      }
      .post-avatar {
        width: 42px; height: 42px; border-radius: 50%;
        background: var(--border); display: flex;
        align-items: center; justify-content: center;
        font-weight: 700; font-size: 0.9rem; color: var(--muted);
        flex-shrink: 0;
      }
      .post-meta-info { line-height: 1.3; }
      .post-author { font-weight: 600; font-size: 0.9rem; }
      .post-role { font-size: 0.78rem; color: var(--muted); }
      .post-body {
        font-size: 0.9rem; line-height: 1.75;
        color: var(--ink);
      }
      .post-body strong { font-weight: 600; }
      @media (max-width: 768px) {
        .style-demo { grid-template-columns: 1fr; }
      }
    `}</style>
    <div className="container">
      <p className="section-tag accent">Voice-matching in action</p>
      <h2 className="section-title">Two users. Same topic. <em>Completely different voices.</em></h2>

      <div className="style-demo">
        <div className="post-card reveal">
          <div className="post-card-label" style={{color:'#0a66c2'}}>
            <span className="label-dot" style={{background:'#0a66c2'}}></span>
            Direct & data-driven founder
          </div>
          <div className="post-meta">
            <div className="post-avatar" style={{background:'#dbeafe', color:'#0a66c2'}}>RK</div>
            <div className="post-meta-info">
              <div className="post-author">Raghav K. · SaaS CEO</div>
              <div className="post-role">Revenue obsessed. Always hiring.</div>
            </div>
          </div>
          <div className="post-body">
            <p>3 things that killed our pipeline last quarter:</p>
            <p>1. Stopped posting → less inbound trust<br/>2. Generic outreach → 0% reply rate<br/>3. Chasing logos → wrong ICP</p>
            <p>Fixed all 3. Q3 is up 40% MoM.</p>
            <p>Consistency &gt; genius. Ship the post.</p>
          </div>
        </div>

        <div className="post-card reveal">
          <div className="post-card-label" style={{color:'#7c3aed'}}>
            <span className="label-dot" style={{background:'#7c3aed'}}></span>
            Storyteller & community builder
          </div>
          <div className="post-meta">
            <div className="post-avatar" style={{background:'#ede9fe', color:'#7c3aed'}}>PM</div>
            <div className="post-meta-info">
              <div className="post-author">Priya M. · Founder & Coach</div>
              <div className="post-role">Building in public. Caffeinated.</div>
            </div>
          </div>
          <div className="post-body">
            <p>I used to spend Sunday nights dreading Monday posts.</p>
            <p>Now I spend 4 minutes and it's done. And it actually sounds like me — the sarcastic, slightly-too-honest version of me that people actually follow.</p>
            <p>Turns out authenticity isn't just what you say.</p>
            <p>It's how you say it. Every. Single. Time.</p>
            <p>If you're still wrestling with the blank page, come talk to me. ✨</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
