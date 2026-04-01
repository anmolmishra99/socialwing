export const TestimonialsSection = () => (
  <section className="proof-section">
    <style jsx>{`
      .proof-section {
        padding: 100px 24px;
        background: var(--ink);
        color: var(--paper);
      }
      .testimonials {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 64px;
      }
      .testi {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 32px;
        transition: background 0.3s;
      }
      .testi:hover {
        background: rgba(255, 255, 255, 0.08);
      }
      .testi-quote {
        font-family: var(--font-instrument);
        font-size: 1.15rem;
        line-height: 1.6;
        color: rgba(245, 241, 235, 0.9);
        margin-bottom: 24px;
        font-style: italic;
      }
      .testi-author {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .testi-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
        color: rgba(245, 241, 235, 0.7);
      }
      .testi-name {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--paper);
      }
      .testi-role {
        font-size: 0.78rem;
        color: rgba(245, 241, 235, 0.45);
      }
      .stars {
        color: var(--gold);
        font-size: 0.75rem;
        margin-bottom: 16px;
      }
      @media (max-width: 768px) {
        .testimonials {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
    <div className="container">
      <p className="section-tag">What they're saying</p>
      <h2 className="section-title">
        Results from founders <em>like you</em>
      </h2>

      <div className="testimonials">
        <div className="testi reveal">
          <div className="stars">★★★★★</div>
          <p className="testi-quote">
            "My team literally asked if I hired a ghostwriter. I told them yes —
            one that costs less than a lunch and never misses a deadline."
          </p>
          <div className="testi-author">
            <div className="testi-avatar">AK</div>
            <div>
              <div className="testi-name">Ankit K.</div>
              <div className="testi-role">
                Foundder, EdTech startup · 8.2K followers
              </div>
            </div>
          </div>
        </div>

        <div className="testi reveal">
          <div className="stars">★★★★★</div>
          <p className="testi-quote">
            "I've tried every AI writing tool. They all make me sound like a
            press release. SocialWing is the only one that nails my dry humor.
            That's everything."
          </p>
          <div className="testi-author">
            <div className="testi-avatar">SR</div>
            <div>
              <div className="testi-name">Sonal R.</div>
              <div className="testi-role">
                VP Sales, B2B SaaS · 14.1K followers
              </div>
            </div>
          </div>
        </div>

        <div className="testi reveal">
          <div className="stars">★★★★★</div>
          <p className="testi-quote">
            "I closed two enterprise deals last quarter directly from LinkedIn
            conversations that started on posts SocialWing drafted. ROI?
            Insane."
          </p>
          <div className="testi-author">
            <div className="testi-avatar">MV</div>
            <div>
              <div className="testi-name">Mihir V.</div>
              <div className="testi-role">
                CEO, MarTech agency · 22K followers
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
