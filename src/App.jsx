import { useState, useEffect, useRef } from "react";

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg-deep: #0a0a0b;
  --bg-surface: #111113;
  --bg-elevated: #1a1a1f;
  --bg-hover: #222228;
  --border: #2a2a32;
  --border-light: #333340;
  --text-primary: #f0efe9;
  --text-secondary: #8e8d93;
  --text-muted: #5a5960;
  --accent: #e8653a;
  --accent-soft: rgba(232, 101, 58, 0.12);
  --success: #2dd4a0;
  --purple: #a78bfa;
  --font-display: 'Fraunces', serif;
  --font-body: 'DM Sans', sans-serif;
  --radius: 12px;
  --radius-sm: 8px;
  --radius-xs: 6px;
}

body { background: var(--bg-deep); font-family: var(--font-body); color: var(--text-primary); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
@keyframes dotBounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-4px); }
}
`;

function useIsMobile(bp = 768) {
  const [m, setM] = useState(window.innerWidth < bp);
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return m;
}

const builderConvo = [
  { role: "agent", text: "Hey! Let's build your event. What are you creating?" },
  { role: "user", text: "A 2-day creative conference called \"Kaleidoscope\" — for designers, developers, and founders. Downtown Detroit, March 2026." },
  { role: "agent", text: "Love it. What's the vibe — polished corporate, or more indie/creative energy?" },
  { role: "user", text: "Definitely indie creative. Think warehouse venue, great food, lots of interaction between attendees." },
  { role: "agent", text: "Perfect. I've started shaping the page with that energy. How many ticket tiers are you thinking?" },
  { role: "user", text: "Three — General ($149), Creator ($299 with workshop access), and VIP ($499 with speaker dinner + front row)." },
  { role: "agent", text: "Got it — I've added the three tiers. For Creator tickets, which workshops should attendees choose from?" },
  { role: "user", text: "\"Design Systems at Scale\", \"AI-Native Products\", and \"Founding Your Studio\"" },
  { role: "agent", text: "Added those as selectable options on Creator. Should VIP also get workshop access, or is the speaker dinner the main differentiator?" },
  { role: "user", text: "VIP gets everything Creator gets, plus the dinner and front row." },
  { role: "agent", text: "Done — VIP inherits Creator perks. I've updated the preview. Here's where we're at:" },
];

const checkoutConvo = [
  { role: "agent", text: "Welcome to Kaleidoscope! I can help you register. Coming solo or bringing a team?" },
  { role: "user", text: "Team of 4 — myself and 3 colleagues from our design studio." },
  { role: "agent", text: "Nice! What tier works? You can mix and match — General ($149), Creator ($299), or VIP ($499)." },
  { role: "user", text: "I'll do VIP for myself, Creator for the other 3." },
  { role: "agent", text: "Great taste. Each Creator can pick a workshop. Want to assign now, or send a link to choose later?" },
  { role: "user", text: "I'll assign now. Sarah wants Design Systems, Mike wants AI-Native, and Priya wants Founding Your Studio." },
  { role: "agent", text: "All set! Your total is $1,396. Any dietary restrictions? The VIP dinner needs that for you." },
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "var(--text-muted)",
          animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite`
        }} />
      ))}
    </div>
  );
}

function Bubble({ msg, isNew }) {
  const isAgent = msg.role === "agent";
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: isAgent ? "flex-start" : "flex-end",
      animation: isNew ? "fadeUp 0.4s ease-out" : "none", animationFillMode: "both",
    }}>
      {isAgent && (
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--accent)", marginBottom: 4, letterSpacing: "0.03em", textTransform: "uppercase" }}>Agent</span>
      )}
      <div style={{
        maxWidth: "85%", padding: "10px 14px",
        borderRadius: isAgent ? "2px 14px 14px 14px" : "14px 14px 2px 14px",
        background: isAgent ? "var(--bg-elevated)" : "var(--accent)",
        color: isAgent ? "var(--text-primary)" : "#fff",
        fontSize: 14, lineHeight: 1.55,
        border: isAgent ? "1px solid var(--border)" : "none",
      }}>{msg.text}</div>
    </div>
  );
}

function Chat({ convo, onProgress, icon, iconBg, title, sub, accent }) {
  const [count, setCount] = useState(1);
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);

  useEffect(() => { onProgress(count); }, [count]);
  useEffect(() => {
    if (count < convo.length) {
      const delay = convo[count].role === "agent" ? 2200 : 1400;
      setTyping(true);
      const t = setTimeout(() => { setTyping(false); setCount(v => v + 1); }, delay);
      return () => clearTimeout(t);
    }
  }, [count, convo.length]);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [count, typing]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-surface)" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "#fff"
        }}>{icon}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{sub}</div>
        </div>
      </div>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {convo.slice(0, count).map((m, i) => <Bubble key={i} msg={m} isNew={i === count - 1} />)}
        {typing && (
          <div style={{ animation: "fadeIn 0.2s ease-out" }}>
            {convo[count]?.role === "agent" && <span style={{ fontSize: 11, fontWeight: 500, color: accent, marginBottom: 4, display: "block", letterSpacing: "0.03em", textTransform: "uppercase" }}>Agent</span>}
            <TypingDots />
          </div>
        )}
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, flexShrink: 0 }}>
        <div style={{ flex: 1, padding: "10px 14px", borderRadius: "var(--radius)", background: "var(--bg-elevated)", border: "1px solid var(--border)", fontSize: 14, color: "var(--text-muted)" }}>Type a message...</div>
        <button style={{ padding: "10px 16px", borderRadius: "var(--radius)", background: accent, border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>↑</button>
      </div>
    </div>
  );
}

function BuilderPreview({ progress, mobile }) {
  const sb = progress >= 2, sv = progress >= 4, st = progress >= 6, sw = progress >= 8, sf = progress >= 10;
  const px = mobile ? 20 : 40;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: `24px ${px}px`, background: "linear-gradient(180deg, var(--bg-deep) 0%, #0d0d10 100%)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: sf ? "var(--success)" : "var(--accent)", boxShadow: sf ? "0 0 8px var(--success)" : "0 0 8px var(--accent)", animation: sf ? "none" : "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>{sf ? "Preview Ready" : "Building..."}</span>
        </div>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Live Preview</span>
      </div>

      {!sb && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50%", textAlign: "center", animation: "fadeIn 0.5s ease-out", padding: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>✦</div>
          <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 280, lineHeight: 1.6 }}>Start describing your event in the chat and watch it come to life here.</p>
        </div>
      )}

      {sb && (
        <div style={{ animation: "fadeUp 0.6s ease-out" }}>
          <div style={{ marginBottom: sv ? 36 : 24 }}>
            <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: 4, background: "var(--accent-soft)", color: "var(--accent)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Mar 14–15, 2026 · Detroit</div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: mobile ? (sv ? 36 : 28) : (sv ? 56 : 42),
              fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 10,
              background: sv ? "linear-gradient(135deg, var(--text-primary) 40%, var(--accent) 100%)" : "none",
              color: sv ? "transparent" : "var(--text-primary)", WebkitBackgroundClip: sv ? "text" : "unset",
            }}>Kaleidoscope</h1>
            <p style={{ fontSize: mobile ? 14 : 17, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 480 }}>
              {sv ? "Two days of raw creative energy. Designers, developers, and founders colliding in a warehouse in downtown Detroit." : "A 2-day creative conference for designers, developers, and founders."}
            </p>
          </div>

          {sv && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36, animation: "fadeUp 0.5s ease-out" }}>
              {["Indie Creative", "Warehouse Venue", "Interactive"].map((t, i) => (
                <span key={i} style={{ padding: "5px 11px", borderRadius: 20, border: "1px solid var(--border-light)", fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          )}

          {st && (
            <div style={{ animation: "fadeUp 0.6s ease-out", marginBottom: 36 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: mobile ? 18 : 22, fontWeight: 400, marginBottom: 16 }}>Choose Your Experience</h3>
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { name: "General", price: "$149", color: "var(--border-light)", perks: ["2-day access", "Community events", "Lunch included"] },
                  { name: "Creator", price: "$299", color: "var(--accent)", perks: ["Everything in General", "Workshop access", "Creator lounge"], featured: true },
                  { name: "VIP", price: "$499", color: "var(--purple)", perks: ["Everything in Creator", "Speaker dinner", "Front row seating"] },
                ].map((tier, i) => (
                  <div key={i} style={{
                    padding: mobile ? 14 : 20, borderRadius: "var(--radius)",
                    background: tier.featured ? "var(--bg-elevated)" : "var(--bg-surface)",
                    border: `1px solid ${tier.featured ? tier.color : "var(--border)"}`,
                    position: "relative", overflow: "hidden", animation: `fadeUp 0.5s ease-out ${i * 0.1}s both`
                  }}>
                    {tier.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }} />}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: mobile ? 8 : 16 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: tier.color, marginBottom: 2 }}>{tier.name}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: mobile ? 22 : 28, fontWeight: 400 }}>{tier.price}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {tier.perks.map((p, j) => (
                        <div key={j} style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: tier.color, fontSize: 8 }}>●</span> {p}
                        </div>
                      ))}
                    </div>
                    {sw && tier.name === "Creator" && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", animation: "fadeUp 0.4s ease-out" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Select Workshop</div>
                        {["Design Systems at Scale", "AI-Native Products", "Founding Your Studio"].map((w, k) => (
                          <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 13, color: "var(--text-secondary)", cursor: "pointer" }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: k === 0 ? "2px solid var(--accent)" : "1.5px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {k === 0 && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />}
                            </div>
                            {w}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sf && (
            <div style={{
              display: "flex", flexDirection: mobile ? "column" : "row",
              alignItems: mobile ? "stretch" : "center", justifyContent: "space-between", gap: 12,
              padding: mobile ? 16 : 20, borderRadius: "var(--radius)",
              background: "var(--accent-soft)", border: "1px solid rgba(232, 101, 58, 0.2)",
              animation: "fadeUp 0.5s ease-out"
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Preview looks good?</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Publish when you're ready.</div>
              </div>
              <button style={{ padding: "10px 24px", borderRadius: "var(--radius-sm)", flexShrink: 0, background: "var(--accent)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Publish Event →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CheckoutReceipt({ progress, mobile }) {
  const showTeam = progress >= 2, showTiers = progress >= 4, showWs = progress >= 6;
  const px = mobile ? 20 : 40;
  const items = showTiers ? [{ label: "VIP × 1 — You", price: 499 }, { label: "Creator × 3", price: 897 }] : [];
  const total = items.reduce((s, l) => s + l.price, 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: `24px ${px}px`, background: "var(--bg-deep)", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: 4, background: "var(--accent-soft)", color: "var(--accent)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Registration</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: mobile ? 24 : 32, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 4 }}>Kaleidoscope 2026</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Mar 14–15 · Detroit, MI</p>
      </div>

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: mobile ? 16 : 24, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Attendees</div>
          {showTeam ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "fadeUp 0.4s ease-out" }}>
              {[
                { name: "You", tier: showTiers ? "VIP" : "—", color: "var(--purple)", ws: null },
                { name: "Sarah", tier: showTiers ? "Creator" : "—", color: "var(--accent)", ws: showWs ? "Design Systems" : null },
                { name: "Mike", tier: showTiers ? "Creator" : "—", color: "var(--accent)", ws: showWs ? "AI-Native" : null },
                { name: "Priya", tier: showTiers ? "Creator" : "—", color: "var(--accent)", ws: showWs ? "Founding Studio" : null },
              ].map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 10px", borderRadius: "var(--radius-xs)",
                  background: "var(--bg-elevated)", border: "1px solid var(--border)",
                  animation: `fadeUp 0.4s ease-out ${i * 0.05}s both`
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                      background: `linear-gradient(135deg, ${a.color}33, ${a.color}11)`,
                      border: `1px solid ${a.color}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 600, color: a.color,
                    }}>{a.name[0]}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                      {a.ws && <div style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.ws}</div>}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: a.color, flexShrink: 0, padding: "2px 8px", borderRadius: 4, background: `${a.color}15` }}>{a.tier}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 16, borderRadius: "var(--radius-xs)", border: "1px dashed var(--border)", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>Attendees will appear as you add them</div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {showTiers && (
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, animation: "fadeUp 0.4s ease-out" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Summary</div>
            {items.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14 }}>
                <span style={{ color: "var(--text-secondary)" }}>{it.label}</span>
                <span style={{ fontWeight: 600, fontFamily: "var(--font-display)" }}>${it.price}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0", marginTop: 8, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--accent)" }}>${total.toLocaleString()}</span>
            </div>
            <button style={{ width: "100%", marginTop: 16, padding: "14px 24px", borderRadius: "var(--radius-sm)", background: "var(--accent)", border: "none", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Complete Registration →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const mobile = useIsMobile();
  const [mode, setMode] = useState("builder");
  const [bp, setBp] = useState(0);
  const [cp, setCp] = useState(0);
  const [panel, setPanel] = useState("chat");

  const convo = mode === "builder" ? builderConvo : checkoutConvo;
  const progress = mode === "builder" ? bp : cp;
  const setProgress = mode === "builder" ? setBp : setCp;

  return (
    <>
      <style>{FONTS_CSS}</style>
      <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-deep)", fontFamily: "var(--font-body)", color: "var(--text-primary)", overflow: "hidden" }}>

        {/* Top Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: mobile ? "0 12px" : "0 24px", height: 48, flexShrink: 0, borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 500, background: "linear-gradient(135deg, var(--accent), var(--purple))", WebkitBackgroundClip: "text", color: "transparent" }}>✦ tkt</span>
            {!mobile && <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, padding: "2px 8px", borderRadius: 4, border: "1px solid var(--border)", letterSpacing: "0.04em" }}>DEMO</span>}
          </div>
          <div style={{ display: "flex", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: 3, border: "1px solid var(--border)" }}>
            {[
              { id: "builder", label: mobile ? "Build" : "Event Builder", icon: "◆" },
              { id: "checkout", label: "Checkout", icon: "◇" },
            ].map(tab => (
              <button key={tab.id} onClick={() => { setMode(tab.id); setPanel("chat"); }} style={{
                padding: mobile ? "6px 12px" : "6px 16px", borderRadius: "var(--radius-xs)",
                border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                background: mode === tab.id ? "var(--bg-hover)" : "transparent",
                color: mode === tab.id ? "var(--text-primary)" : "var(--text-muted)",
                transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: 5,
              }}>
                <span style={{ fontSize: 9 }}>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
          <div style={{ width: mobile ? 40 : 80 }} />
        </div>

        {/* Mobile Panel Toggle */}
        {mobile && (
          <div style={{ display: "flex", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)", padding: 6, flexShrink: 0 }}>
            {[
              { id: "preview", label: mode === "builder" ? "Preview" : "Receipt" },
              { id: "chat", label: "Chat" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setPanel(tab.id)} style={{
                flex: 1, padding: "8px 0", borderRadius: "var(--radius-xs)",
                border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                background: panel === tab.id ? "var(--bg-hover)" : "transparent",
                color: panel === tab.id ? "var(--text-primary)" : "var(--text-muted)",
                transition: "all 0.2s ease",
              }}>{tab.label}</button>
            ))}
          </div>
        )}

        {/* Main */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {mobile ? (
            panel === "preview" ? (
              mode === "builder"
                ? <BuilderPreview progress={bp} mobile={true} />
                : <CheckoutReceipt progress={cp} mobile={true} />
            ) : (
              mode === "builder"
                ? <Chat convo={builderConvo} onProgress={setBp} icon="✦" iconBg="linear-gradient(135deg, var(--accent), #d4451a)" title="Event Builder" sub="Describe your vision" accent="var(--accent)" />
                : <Chat convo={checkoutConvo} onProgress={setCp} icon="✦" iconBg="linear-gradient(135deg, var(--purple), #7c5ce0)" title="Registration Assistant" sub="Kaleidoscope 2026" accent="var(--purple)" />
            )
          ) : (
            <>
              {mode === "builder"
                ? <BuilderPreview progress={bp} mobile={false} />
                : <CheckoutReceipt progress={cp} mobile={false} />
              }
              <div style={{ width: 420, flexShrink: 0, borderLeft: "1px solid var(--border)" }}>
                {mode === "builder"
                  ? <Chat convo={builderConvo} onProgress={setBp} icon="✦" iconBg="linear-gradient(135deg, var(--accent), #d4451a)" title="Event Builder" sub="Describe your vision" accent="var(--accent)" />
                  : <Chat convo={checkoutConvo} onProgress={setCp} icon="✦" iconBg="linear-gradient(135deg, var(--purple), #7c5ce0)" title="Registration Assistant" sub="Kaleidoscope 2026" accent="var(--purple)" />
                }
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
