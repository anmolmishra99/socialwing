"use client";
import React, { useState } from "react";

export const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqData = [
    {
      q: "Will my followers know it's AI-generated?",
      a: "Unlikely — and that's the whole point. Generic AI tools write in a universal 'AI voice.' We write in YOUR voice. Since we train on your actual posts, your vocabulary, your sentence length, your hooks — the output is statistically close to something you'd write. Many of our users say even their closest team members can't tell.",
    },
    {
      q: "What if I barely have any posts? Can it still learn my style?",
      a: "Yes. We can work with as few as 5–8 posts. For newer accounts, we start with a style questionnaire that captures your tone, vocabulary preferences, and the kind of topics you care about. As you create more posts (with our help), the fingerprint gets sharper over time.",
    },
    {
      q: "How is this different from just using ChatGPT with a custom prompt?",
      a: "Great question. With ChatGPT, you describe your style in words — which is inherently imprecise. We analyze it algorithmically from your actual posts. We measure your average sentence length, hook patterns, punctuation habits, emoji usage, how you open, how you close. No prompt can capture that. It's the difference between telling a designer your aesthetic vs. showing them your entire portfolio.",
    },
    {
      q: "Is my LinkedIn data safe?",
      a: "Absolutely. We read your public posts to build your voice fingerprint, but we never store your LinkedIn credentials, and your data is never used to train shared models. Your voice profile is private, encrypted, and belongs only to you. You can delete it anytime.",
    },
    {
      q: "What if I hate the generated post?",
      a: "Regenerate it with different parameters in one click. And when you edit a draft before posting, your edits teach the model your preferences — so future drafts drift closer to exactly what you'd write. It's a feedback loop, not a one-shot tool.",
    },
  ];

  return (
    <section className="faq-section" id="faq">
      <style jsx>{`
        /* ── Shell ── */
        .faq-section {
          padding: 140px 24px 120px;
          background: #f5f0ea;
          position: relative;
          overflow: hidden;
        }

        /* ── SVG background ── */
        .faq-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Blobs ── */
        .faq-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
          z-index: 0;
        }
        .faq-blob-1 {
          width: 500px;
          height: 380px;
          top: -80px;
          right: -60px;
          background: radial-gradient(
            ellipse,
            rgba(10, 102, 194, 0.08) 0%,
            transparent 70%
          );
        }
        .faq-blob-2 {
          width: 420px;
          height: 320px;
          bottom: -60px;
          left: -80px;
          background: radial-gradient(
            ellipse,
            rgba(232, 82, 26, 0.07) 0%,
            transparent 70%
          );
        }

        /* ── Inner ── */
        .faq-inner {
          position: relative;
          z-index: 1;
          max-width: 700px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .faq-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--blue, #0a66c2);
          margin-bottom: 18px;
        }
        .faq-eyebrow-line {
          width: 28px;
          height: 1px;
          background: rgba(10, 102, 194, 0.35);
        }
        .faq-title {
          font-family: var(--font-instrument, Georgia, serif);
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--ink, #0f0f0f);
          margin-bottom: 64px;
        }
        .faq-title em {
          font-style: italic;
          color: var(--accent, #e8521a);
        }

        /* ── List ── */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ── Item ── */
        .faq-item {
          border-bottom: 1px solid rgba(10, 10, 10, 0.1);
          position: relative;
        }
        .faq-item:first-child {
          border-top: 1px solid rgba(10, 10, 10, 0.1);
        }

        /* left accent bar that fills in when open */
        .faq-item::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--accent, #e8521a);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.3s ease;
          border-radius: 0 2px 2px 0;
        }
        .faq-item.open::before {
          transform: scaleY(1);
        }

        /* ── Question button ── */
        .faq-q {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          padding: 26px 0 26px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-dm-sans, sans-serif);
          font-size: 1rem;
          font-weight: 500;
          color: var(--ink, #0f0f0f);
          gap: 20px;
          transition: padding-left 0.25s;
        }
        .faq-item.open .faq-q {
          padding-left: 24px;
          font-weight: 600;
        }

        /* chevron icon */
        .faq-chevron-wrap {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid rgba(10, 10, 10, 0.12);
          background: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition:
            background 0.25s,
            border-color 0.25s,
            transform 0.3s;
        }
        .faq-item.open .faq-chevron-wrap {
          background: var(--accent, #e8521a);
          border-color: var(--accent, #e8521a);
          transform: rotate(180deg);
        }
        .faq-chevron-wrap svg {
          transition: stroke 0.25s;
        }
        .faq-item.open .faq-chevron-wrap svg {
          stroke: white;
        }

        /* ── Answer ── */
        .faq-a-wrap {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-item.open .faq-a-wrap {
          max-height: 400px;
        }
        .faq-a {
          font-size: 0.9rem;
          color: #7a7060;
          line-height: 1.8;
          padding: 0 20px 28px 24px;
        }

        /* ── Bottom CTA strip ── */
        .faq-cta-strip {
          margin-top: 64px;
          padding: 36px 40px;
          background: var(--ink, #0f0f0f);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
        }
        .faq-cta-strip::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 70% 80% at 0% 50%,
            rgba(232, 82, 26, 0.12) 0%,
            transparent 60%
          );
          pointer-events: none;
        }
        /* accent top bar */
        .faq-cta-strip::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            var(--accent, #e8521a) 0%,
            rgba(232, 82, 26, 0.2) 60%,
            transparent 100%
          );
        }
        .faq-cta-text {
          font-family: var(--font-instrument, Georgia, serif);
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.88);
          font-style: italic;
          position: relative;
          z-index: 1;
        }
        .faq-cta-text strong {
          font-style: normal;
          color: #fff;
        }
        .faq-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--accent, #e8521a);
          color: white;
          padding: 13px 26px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: -0.01em;
          white-space: nowrap;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }
        .faq-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(232, 82, 26, 0.38);
        }

        @media (max-width: 600px) {
          .faq-cta-strip {
            flex-direction: column;
            align-items: flex-start;
            padding: 28px 24px;
          }
        }
      `}</style>

      {/* SVG background */}
      <svg
        className="faq-bg"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* angled hatching — warm paper feel */}
          <pattern
            id="faq-hatch"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-30)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="24"
              stroke="rgba(10,10,10,0.04)"
              strokeWidth="1"
            />
          </pattern>
          {/* mask: hatch only on edges */}
          <radialGradient id="faq-mask-grad" cx="50%" cy="50%" r="52%">
            <stop offset="0%" stopColor="black" stopOpacity="0" />
            <stop offset="55%" stopColor="black" stopOpacity="0.5" />
            <stop offset="100%" stopColor="black" stopOpacity="1" />
          </radialGradient>
          <mask id="faq-hatch-mask">
            <rect width="100%" height="100%" fill="url(#faq-mask-grad)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#faq-hatch)"
          mask="url(#faq-hatch-mask)"
        />
        {/* large arcs top-right */}
        <circle
          cx="100%"
          cy="0"
          r="350"
          fill="none"
          stroke="rgba(10,102,194,0.05)"
          strokeWidth="1"
        />
        <circle
          cx="100%"
          cy="0"
          r="500"
          fill="none"
          stroke="rgba(10,102,194,0.03)"
          strokeWidth="1"
        />
        {/* bottom-left arc */}
        <circle
          cx="0"
          cy="100%"
          r="280"
          fill="none"
          stroke="rgba(232,82,26,0.05)"
          strokeWidth="1"
        />
      </svg>

      <div className="faq-blob faq-blob-1" aria-hidden="true" />
      <div className="faq-blob faq-blob-2" aria-hidden="true" />

      <div className="faq-inner">
        <p className="faq-eyebrow">
          <span className="faq-eyebrow-line" />
          Common questions
          <span className="faq-eyebrow-line" />
        </p>
        <h2 className="faq-title">
          Answered <em>honestly.</em>
        </h2>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item${openFaq === index ? " open" : ""}`}
            >
              <button
                className="faq-q"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                {item.q}
                <span className="faq-chevron-wrap">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(10,10,10,0.5)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              <div className="faq-a-wrap">
                <div className="faq-a">{item.a}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="faq-cta-strip">
          <p className="faq-cta-text">
            <strong>Still have questions?</strong> We reply within 2 hours.
          </p>
          <a href="#" className="faq-cta-btn">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Chat with us →
          </a>
        </div>
      </div>
    </section>
  );
};
