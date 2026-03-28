export const HowItWorksSection = () => (
  <section className="hiw-section" id="how-it-works">
    <style jsx>{`
      .hiw-section { padding: 100px 24px; background: var(--paper); }
      .steps { margin-top: 64px; display: flex; flex-direction: column; gap: 0; }
      .step {
        display: grid; grid-template-columns: 80px 1fr;
        gap: 32px; padding: 40px 0;
        border-bottom: 1px solid var(--border);
        position: relative;
      }
      .step:last-child { border-bottom: none; }
      .step-num {
        font-family: var(--font-instrument);
        font-size: 3.5rem; color: var(--border);
        font-style: italic; line-height: 1;
        padding-top: 8px;
      }
      .step-content h3 {
        font-family: var(--font-syne);
        font-size: 1.25rem; font-weight: 700;
        margin-bottom: 10px; letter-spacing: -0.01em;
      }
      .step-content p {
        font-size: 0.95rem; color: var(--muted);
        line-height: 1.7; max-width: 500px;
      }
      .step-content p strong { color: var(--ink); }
      .step-tag {
        display: inline-block;
        background: var(--accent-soft); color: var(--accent);
        font-size: 0.72rem; font-weight: 700;
        letter-spacing: 0.08em; text-transform: uppercase;
        padding: 4px 10px; border-radius: 4px;
        margin-bottom: 12px;
      }
      @media (max-width: 768px) {
        .step { grid-template-columns: 1fr; gap: 16px; }
      }
    `}</style>
    <div className="container-narrow">
      <p className="section-tag">Dead simple</p>
      <h2 className="section-title">From zero to <em>authentic post</em> in 4 minutes.</h2>

      <div className="steps">
        <div className="step reveal">
          <div className="step-num">01</div>
          <div className="step-content">
            <span className="step-tag">One-time setup</span>
            <h3>Connect your LinkedIn profile</h3>
            <p>We analyze your <strong>last 20–50 posts</strong> — your sentence structure, how you open a post, what hooks you use, how you close. We build a private "voice fingerprint" that lives only in your account.</p>
          </div>
        </div>

        <div className="step reveal">
          <div className="step-num">02</div>
          <div className="step-content">
            <span className="step-tag">Daily — 30 seconds</span>
            <h3>Drop in a topic or rough thought</h3>
            <p>Tell us what you want to post about. Could be <strong>"fundraising rejection I got this week"</strong> or <strong>"why cold DMs don't work anymore"</strong>. One sentence is enough. We do the rest.</p>
          </div>
        </div>

        <div className="step reveal">
          <div className="step-num">03</div>
          <div className="step-content">
            <span className="step-tag">Takes 3 minutes</span>
            <h3>Get a post that sounds like you wrote it at 11pm on a Tuesday</h3>
            <p>We generate a full post using your voice fingerprint. It has your <strong>quirks, your cadence, your typical hook style.</strong> Review it, make a tweak or two, and post. Done.</p>
          </div>
        </div>

        <div className="step reveal">
          <div className="step-num">04</div>
          <div className="step-content">
            <span className="step-tag">Compounding returns</span>
            <h3>It gets better the more you use it</h3>
            <p>Every post you edit or approve teaches draftfor.me your preferences. Over time, it needs <strong>less and less intervention</strong> — some users post in under 2 minutes.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
