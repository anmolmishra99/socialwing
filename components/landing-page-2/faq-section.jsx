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
        .faq-section { padding: 80px 24px 100px; }
        .faq-list { margin-top: 48px; }
        .faq-item { border-bottom: 1px solid var(--border); padding: 0; }
        .faq-q {
          width: 100%; text-align: left;
          background: none; border: none; cursor: pointer;
          padding: 24px 0; display: flex; justify-content: space-between; align-items: center;
          font-family: var(--font-dm-sans);
          font-size: 1rem; font-weight: 500; color: var(--ink);
          gap: 16px;
        }
        .faq-chevron { transition: transform 0.25s; font-size: 1.1rem; opacity: 0.4; flex-shrink: 0; }
        .faq-item.open .faq-chevron { transform: rotate(180deg); opacity: 1; }
        .faq-a {
          max-height: 0; overflow: hidden;
          transition: max-height 0.4s ease, padding 0.3s;
          font-size: 0.9rem; color: var(--muted); line-height: 1.75;
        }
        .faq-item.open .faq-a { max-height: 300px; padding-bottom: 24px; }
      `}</style>
      <div className="container-narrow">
        <p className="section-tag">Common questions</p>
        <h2 className="section-title">Answered <em>honestly.</em></h2>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <div key={index} className={`faq-item ${openFaq === index ? "open" : ""}`}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                {item.q}
                <span className="faq-chevron">▾</span>
              </button>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
