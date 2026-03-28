"use client";
import React from "react";

export const PricingSection = () => (
  <section className="pricing-section" id="pricing">
    <style jsx>{`
      .pricing-section { padding: 100px 24px; }
      .pricing-toggle {
        display: flex; align-items: center; gap: 14px;
        justify-content: center; margin: 40px 0;
      }
      .toggle-label { font-size: 0.9rem; color: var(--muted); font-weight: 500; }
      .toggle-label.active { color: var(--ink); font-weight: 600; }
      .toggle-pill {
        width: 48px; height: 26px;
        background: var(--ink); border-radius: 100px;
        position: relative; cursor: pointer;
        display: flex; align-items: center; padding: 3px;
      }
      .toggle-dot {
        width: 20px; height: 20px; border-radius: 50%;
        background: white; transition: transform 0.25s;
      }
      .save-badge {
        background: var(--accent-soft); color: var(--accent);
        font-size: 0.72rem; font-weight: 700;
        padding: 3px 10px; border-radius: 100px;
        letter-spacing: 0.04em;
      }
      .pricing-grid {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 20px; max-width: 1000px; margin: 0 auto;
      }
      .plan {
        border-radius: 16px; padding: 36px 32px;
        border: 1.5px solid var(--border);
        background: var(--card);
        position: relative; overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .plan:hover { transform: translateY(-4px); }
      .plan.featured {
        background: var(--ink); color: var(--paper);
        border-color: var(--ink);
        transform: scale(1.03);
      }
      .plan.featured:hover { transform: scale(1.03) translateY(-4px); }
      .plan-badge {
        position: absolute; top: 20px; right: 20px;
        background: var(--accent); color: white;
        font-size: 0.65rem; font-weight: 800;
        letter-spacing: 0.08em; text-transform: uppercase;
        padding: 4px 12px; border-radius: 100px;
      }
      .plan-name {
        font-family: var(--font-syne);
        font-size: 0.8rem; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase;
        margin-bottom: 20px; opacity: 0.5;
      }
      .plan-price {
        font-family: var(--font-instrument);
        font-size: 3rem; line-height: 1;
        letter-spacing: -0.02em;
        margin-bottom: 4px;
      }
      .plan-period {
        font-size: 0.85rem; opacity: 0.5;
        margin-bottom: 28px; font-weight: 400;
      }
      .plan-desc {
        font-size: 0.875rem; line-height: 1.6;
        margin-bottom: 28px; opacity: 0.65;
      }
      .plan-features {
        list-style: none; margin-bottom: 36px;
        display: flex; flex-direction: column; gap: 12px;
      }
      .plan-features li {
        font-size: 0.88rem; display: flex; align-items: flex-start; gap: 10px;
        line-height: 1.4;
      }
      .plan-features li::before {
        content: '✓'; color: var(--accent);
        font-weight: 700; flex-shrink: 0; margin-top: 1px;
      }
      .plan.featured .plan-features li::before { color: var(--gold); }
      .plan-cta {
        width: 100%; padding: 14px;
        border-radius: 8px; border: 1.5px solid;
        font-family: var(--font-dm-sans);
        font-size: 0.95rem; font-weight: 600;
        cursor: pointer; transition: all 0.2s;
        text-align: center; text-decoration: none;
        display: block;
      }
      .plan.free .plan-cta {
        border-color: var(--border); color: var(--ink);
        background: transparent;
      }
      .plan.free .plan-cta:hover { background: var(--paper); }
      .plan.featured .plan-cta {
        border-color: var(--accent); color: white;
        background: var(--accent);
      }
      .plan.featured .plan-cta:hover { background: #d4461a; transform: none; box-shadow: 0 8px 24px rgba(232,82,26,0.3); }
      .plan.team .plan-cta {
        border-color: var(--ink); color: var(--ink);
        background: transparent;
      }
      .plan.team .plan-cta:hover { background: var(--ink); color: var(--paper); }
      @media (max-width: 768px) {
        .pricing-grid { grid-template-columns: 1fr; }
        .plan.featured { transform: none; }
      }
    `}</style>
    <div className="container">
      <div style={{ textAlign: "center" }}>
        <p className="section-tag" style={{ textAlign: "center" }}>Simple pricing</p>
        <h2 className="section-title" style={{ textAlign: "center" }}>Less than one <em>bad hire's</em> first day.</h2>
        <p style={{ color: "var(--muted)", maxWidth: "480px", margin: "16px auto 0", fontSize: "0.95rem", lineHeight: "1.6" }}>
          One consistent LinkedIn presence can generate more pipeline than an entire outbound team. This is the cheapest hire you'll ever make.
        </p>
      </div>

      <div className="pricing-toggle">
        <span className="toggle-label">Monthly</span>
        <div className="toggle-pill" onClick={(e) => {
          const dot = e.currentTarget.querySelector('.toggle-dot');
          if (dot.style.transform === 'translateX(22px)') {
            dot.style.transform = 'translateX(0px)';
          } else {
            dot.style.transform = 'translateX(22px)';
          }
        }}>
          <div className="toggle-dot"></div>
        </div>
        <span className="toggle-label active">Annual</span>
        <span className="save-badge">Save 40%</span>
      </div>

      <div className="pricing-grid">
        <div className="plan free">
          <div className="plan-name">Starter</div>
          <div className="plan-price">Free</div>
          <div className="plan-period">forever — no card needed</div>
          <p className="plan-desc">For curious founders who want to test the voice magic before committing.</p>
          <ul className="plan-features">
            <li>5 posts per month</li>
            <li>Basic voice analysis (last 10 posts)</li>
            <li>3 content formats</li>
            <li>LinkedIn connect</li>
          </ul>
          <a href="#" className="plan-cta">Get started free</a>
        </div>

        <div className="plan featured">
          <div className="plan-badge">Most popular</div>
          <div className="plan-name" style={{ color: "rgba(245,241,235,0.5)" }}>Pro</div>
          <div className="plan-price">$29</div>
          <div className="plan-period">/month · billed annually ($49/mo monthly)</div>
          <p className="plan-desc" style={{ color: "rgba(245,241,235,0.6)" }}>For founders & executives who need to show up daily without thinking about it.</p>
          <ul className="plan-features">
            <li>Unlimited posts</li>
            <li>Deep voice fingerprint (50+ posts)</li>
            <li>All 12 content formats (hooks, stories, carousels, polls)</li>
            <li>Auto-learns from your edits</li>
            <li>Engagement analytics</li>
            <li>1-click schedule & post</li>
            <li>Priority support</li>
          </ul>
          <a href="#" className="plan-cta">Start 7-day free trial →</a>
        </div>

        <div className="plan team">
          <div className="plan-name">Agency / Team</div>
          <div className="plan-price">$99</div>
          <div className="plan-period">/month · up to 10 seats</div>
          <p className="plan-desc">For sales teams and agencies managing multiple executives' voices.</p>
          <ul className="plan-features">
            <li>Everything in Pro × 10 seats</li>
            <li>Separate voice profiles per user</li>
            <li>Team content calendar</li>
            <li>Client approval workflows</li>
            <li>White-label option available</li>
            <li>Dedicated onboarding call</li>
          </ul>
          <a href="#" className="plan-cta">Talk to us</a>
        </div>
      </div>

      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.82rem", marginTop: "28px" }}>
        💳 No credit card required for free trial · Cancel anytime · 14-day money back guarantee
      </p>
    </div>
  </section>
);
