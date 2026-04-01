"use client";

import { useState } from "react";

export default function AutoReply() {
  const [rules, setRules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRule, setNewRule] = useState({ keywords: "", reply: "", platform: "all", enabled: true });

  const addRule = () => {
    if (!newRule.keywords.trim() || !newRule.reply.trim()) return;
    setRules([...rules, { ...newRule, id: Date.now() }]);
    setNewRule({ keywords: "", reply: "", platform: "all", enabled: true });
    setShowForm(false);
  };

  const toggleRule = (id) => { setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))); };
  const deleteRule = (id) => { setRules(rules.filter((r) => r.id !== id)); };

  return (
    <div style={{ maxWidth: "900px", position: "relative" }}>
      <div style={{ position: "absolute", top: "-20px", right: "-10px", fontSize: "8rem", fontWeight: 900, color: "rgba(0,0,0,0.02)", letterSpacing: "-0.04em", pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>AUTOMATE</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "1.8rem", color: "#000", letterSpacing: "-0.03em", marginBottom: "6px" }}>Auto Reply</h2>
          <p style={{ color: "#666", fontSize: "0.95rem", fontWeight: 500 }}>Set up automated responses based on keywords.</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: "#5945FE", color: "#fff", border: "2px solid #000", borderRadius: "6px", boxShadow: "3px 3px 0 #000", padding: "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", transition: "transform 0.1s, box-shadow 0.1s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "1px 1px 0 #000"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "3px 3px 0 #000"; }}
        >+ New Rule</button>
      </div>

      {/* New Rule Form */}
      {showForm && (
        <div style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "4px 4px 0 #000", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#000", marginBottom: "20px" }}>Create Auto Reply Rule</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontWeight: 700, fontSize: "0.78rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Trigger Keywords</label>
              <input value={newRule.keywords} onChange={(e) => setNewRule({ ...newRule, keywords: e.target.value })} placeholder="e.g. price, discount, how much (comma separated)" style={{ width: "100%", padding: "10px 14px", border: "2px solid #000", borderRadius: "6px", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif", fontWeight: 500 }} />
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: "0.78rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Auto Reply Message</label>
              <div style={{ position: "relative" }}>
                <textarea value={newRule.reply} onChange={(e) => setNewRule({ ...newRule, reply: e.target.value })} placeholder="Type your reply or use AI to generate one..." style={{ width: "100%", minHeight: "100px", padding: "10px 14px", border: "2px solid #000", borderRadius: "6px", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif", fontWeight: 500, resize: "vertical" }} />
                <button style={{ position: "absolute", bottom: "12px", right: "12px", background: "#f0eeff", border: "1.5px solid #d4cfff", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, color: "#5945FE", display: "flex", alignItems: "center", gap: "4px" }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#5945FE" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  Generate with AI
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: "0.78rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Platform</label>
              <select value={newRule.platform} onChange={(e) => setNewRule({ ...newRule, platform: e.target.value })} style={{ padding: "10px 14px", border: "2px solid #000", borderRadius: "6px", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif", fontWeight: 600, background: "#fff", cursor: "pointer" }}>
                <option value="all">All Platforms</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option><option value="facebook">Facebook</option><option value="linkedin">LinkedIn</option><option value="twitter">X / Twitter</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button onClick={addRule} style={{ background: "#5945FE", color: "#fff", border: "2px solid #000", borderRadius: "6px", boxShadow: "3px 3px 0 #000", padding: "10px 24px", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", transition: "transform 0.1s, box-shadow 0.1s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "1px 1px 0 #000"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "3px 3px 0 #000"; }}
              >Save Rule</button>
              <button onClick={() => setShowForm(false)} style={{ background: "#fff", color: "#000", border: "2px solid #000", borderRadius: "6px", padding: "10px 24px", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Rules list */}
      {rules.length === 0 && !showForm ? (
        <div style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "3px 3px 0 #000", padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "6rem", fontWeight: 900, color: "rgba(0,0,0,0.02)", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>NO RULES</span>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#ccc" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /><path strokeLinecap="round" d="M9 10h6M9 13h3" />
          </svg>
          <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#000", marginBottom: "6px", position: "relative" }}>No auto-reply rules yet</p>
          <p style={{ fontSize: "0.9rem", color: "#888", fontWeight: 500, maxWidth: "380px", margin: "0 auto", position: "relative" }}>Create rules to automatically respond to comments containing specific keywords. Uses Gemini AI to generate smart replies.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {rules.map((rule) => (
            <div key={rule.id} style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "3px 3px 0 #000", padding: "20px", opacity: rule.enabled ? 1 : 0.5, transition: "opacity 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                    {rule.keywords.split(",").map((kw, i) => (
                      <span key={i} style={{ background: "#f0eeff", color: "#5945FE", padding: "3px 10px", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 700, border: "1px solid #d4cfff" }}>{kw.trim()}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#333", lineHeight: 1.5 }}>{rule.reply}</p>
                  <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "8px", fontWeight: 600, textTransform: "uppercase" }}>{rule.platform === "all" ? "All Platforms" : rule.platform}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button onClick={() => toggleRule(rule.id)} style={{ background: rule.enabled ? "#06D6A0" : "#eee", color: rule.enabled ? "#fff" : "#999", border: "2px solid #000", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem" }}>{rule.enabled ? "ON" : "OFF"}</button>
                  <button onClick={() => deleteRule(rule.id)} style={{ background: "#FF4D6D", color: "#fff", border: "2px solid #000", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem" }}>X</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
