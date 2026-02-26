import { useState, useEffect, useRef } from "react";

// ─── Styles ──────────────────────────────────────────────────────────────────

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }

:root {
  --bg: #faf9f7;
  --bg-card: #ffffff;
  --bg-elevated: #f3f2ef;
  --bg-hover: #eae9e4;
  --border: #e5e3dd;
  --border-light: #d5d3cc;
  --text-primary: #1a1918;
  --text-secondary: #6e6d68;
  --text-muted: #a3a29c;
  --accent: #e8653a;
  --accent-soft: rgba(232, 101, 58, 0.06);
  --accent-glow: rgba(232, 101, 58, 0.12);
  --purple: #7c5ce0;
  --purple-soft: rgba(124, 92, 224, 0.06);
  --success: #16a34a;
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --r: 14px;
  --r-sm: 10px;
  --r-xs: 6px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.03);
  --shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03);
  --shadow-lg: 0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.05);
}

body {
  background: var(--bg);
  font-family: var(--font-body);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
@keyframes glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
@keyframes dotBounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }
`;

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useIsMobile(bp = 768) {
  const [m, setM] = useState(window.innerWidth < bp);
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return m;
}

// ─── Data ────────────────────────────────────────────────────────────────────

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
  { role: "agent", text: "Done — VIP inherits Creator perks. Your event page is ready." },
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

// ─── Homepage ────────────────────────────────────────────────────────────────

function Homepage({ onOpenDemo, mobile }) {
  return (
    <div style={{
      width: "100vw", minHeight: "100vh",
      background: "var(--bg)",
      fontFamily: "var(--font-body)", color: "var(--text-primary)",
      animation: "fadeIn 0.5s ease-out",
    }}>
      {/* Nav */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: mobile ? "0 20px" : "0 40px",
        height: 56, borderBottom: "1px solid var(--border)",
        background: "var(--bg-card)",
      }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500,
          background: "linear-gradient(135deg, var(--accent), var(--purple))",
          WebkitBackgroundClip: "text", color: "transparent",
        }}>tkt</span>
        {!mobile && <RequestButton />}
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 960, margin: "0 auto",
        padding: mobile ? "56px 24px 48px" : "10vh 40px 8vh",
        textAlign: "center",
      }}>
        {/* Ornament */}
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 22,
          background: "linear-gradient(135deg, var(--accent), var(--purple))",
          WebkitBackgroundClip: "text", color: "transparent",
          marginBottom: 20, opacity: 0.5,
          animation: "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}>✦</div>

        {/* Hero */}
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: mobile ? 38 : 58,
          fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
          marginBottom: 20,
          animation: "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both",
        }}>
          <span style={{ display: "block" }}>One conversation.</span>
          <span style={{ display: "block" }}>Every ticket.</span>
        </h1>

        <p style={{
          fontSize: mobile ? 16 : 18, color: "var(--text-secondary)",
          lineHeight: 1.65, maxWidth: 520, margin: "0 auto",
          fontWeight: 400,
          animation: "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
        }}>
          Organizers describe their event. Attendees chat to register.
          <br />No forms, no dashboards — just conversation.
        </p>

        {/* Demo Cards */}
        <div style={{
          display: "flex", flexDirection: mobile ? "column" : "row",
          gap: 16, marginTop: mobile ? 48 : 64,
          justifyContent: "center", textAlign: "left",
          animation: "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
        }}>
          <DemoCard
            tag="For organizers"
            accent="var(--accent)"
            messages={[
              { role: "agent", text: "What are you creating?" },
              { role: "user", text: "A 2-day creative conference called \"Kaleidoscope\" — downtown Detroit." },
            ]}
            description="tkt builds your event page as you describe it — tiers, workshops, checkout, and all."
            cta="Watch it build"
            onClick={() => onOpenDemo("builder")}
          />
          <DemoCard
            tag="For attendees"
            accent="var(--purple)"
            messages={[
              { role: "agent", text: "Coming solo or bringing a team?" },
              { role: "user", text: "Team of 4 — VIP for myself, Creator for the other 3." },
            ]}
            description="Attendees register through conversation. No forms, no friction — just talk."
            cta="Watch it work"
            onClick={() => onOpenDemo("checkout")}
          />
        </div>
      </div>
    </div>
  );
}

function DemoCard({ tag, accent, messages, description, cta, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, maxWidth: 460, cursor: "pointer",
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? accent + "40" : "var(--border)"}`,
        borderRadius: 16, padding: 28,
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow)",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{
        fontSize: 10, fontWeight: 600, color: accent,
        letterSpacing: "0.08em", textTransform: "uppercase",
        marginBottom: 16,
      }}>{tag}</div>

      {/* Mini chat */}
      <div style={{
        background: "var(--bg)", borderRadius: 10, padding: 14,
        marginBottom: 20, display: "flex", flexDirection: "column", gap: 8,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "agent" ? "flex-start" : "flex-end" }}>
            {m.role === "agent" && (
              <span style={{ fontSize: 9, fontWeight: 600, color: accent, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>tkt</span>
            )}
            <div style={{
              maxWidth: "88%", padding: "8px 12px",
              borderRadius: m.role === "agent" ? "3px 12px 12px 12px" : "12px 12px 3px 12px",
              background: m.role === "agent" ? "var(--bg-card)" : accent,
              color: m.role === "agent" ? "var(--text-primary)" : "#fff",
              fontSize: 13, lineHeight: 1.5,
              border: m.role === "agent" ? "1px solid var(--border)" : "none",
            }}>{m.text}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
        {description}
      </p>

      <span style={{ fontSize: 14, fontWeight: 600, color: accent }}>
        {cta} →
      </span>
    </div>
  );
}

function RequestButton() {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "7px 16px", borderRadius: 8,
        background: h ? "var(--accent)" : "transparent",
        border: `1px solid ${h ? "var(--accent)" : "var(--border)"}`,
        color: h ? "#fff" : "var(--text-secondary)",
        fontSize: 13, fontWeight: 500, cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >Request Access</button>
  );
}

// ─── Chat Components ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "10px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: "50%", background: "var(--border-light)",
          animation: `dotBounce 1.4s ease-in-out ${i * 0.16}s infinite`,
        }} />
      ))}
    </div>
  );
}

function Bubble({ msg, isNew, accent }) {
  const isAgent = msg.role === "agent";
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: isAgent ? "flex-start" : "flex-end",
      animation: isNew ? "fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
      animationFillMode: "both",
    }}>
      {isAgent && (
        <span style={{
          fontSize: 10, fontWeight: 600, color: accent,
          marginBottom: 5, letterSpacing: "0.06em", textTransform: "uppercase",
        }}>tkt</span>
      )}
      <div style={{
        maxWidth: "88%", padding: "11px 15px",
        borderRadius: isAgent ? "3px 16px 16px 16px" : "16px 16px 3px 16px",
        background: isAgent ? "var(--bg-elevated)" : accent,
        color: isAgent ? "var(--text-primary)" : "#fff",
        fontSize: 13.5, lineHeight: 1.6,
        border: isAgent ? "1px solid var(--border)" : "none",
      }}>{msg.text}</div>
    </div>
  );
}

function Chat({ convo, onProgress, title, sub, accent }) {
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
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [count, typing]);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "var(--bg-card)",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: accent === "var(--accent)" ? "var(--accent-soft)" : "var(--purple-soft)",
          border: `1px solid ${accent}20`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color: accent,
        }}>✦</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{sub}</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={ref} style={{
        flex: 1, overflowY: "auto", padding: "20px 18px",
        display: "flex", flexDirection: "column", gap: 16,
        background: "var(--bg)",
      }}>
        {convo.slice(0, count).map((m, i) => (
          <Bubble key={i} msg={m} isNew={i === count - 1} accent={accent} />
        ))}
        {typing && (
          <div style={{ animation: "fadeIn 0.15s ease-out" }}>
            {convo[count]?.role === "agent" && (
              <span style={{
                fontSize: 10, fontWeight: 600, color: accent,
                marginBottom: 5, display: "block",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>tkt</span>
            )}
            <TypingDots />
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 18px", borderTop: "1px solid var(--border)",
        display: "flex", gap: 8, flexShrink: 0,
      }}>
        <div style={{
          flex: 1, padding: "11px 16px", borderRadius: 10,
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          fontSize: 13, color: "var(--text-muted)",
        }}>Type a message...</div>
        <button style={{
          width: 40, height: 40, borderRadius: 10,
          background: accent, border: "none", color: "#fff",
          fontSize: 16, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>↑</button>
      </div>
    </div>
  );
}

// ─── Browser Frame ───────────────────────────────────────────────────────────

function BrowserFrame({ children, url }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      margin: 14, borderRadius: 14,
      border: "1px solid var(--border)",
      overflow: "hidden", background: "var(--bg-card)",
      boxShadow: "var(--shadow-lg)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 14px", borderBottom: "1px solid var(--border)",
        background: "var(--bg-elevated)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 9, height: 9, borderRadius: "50%",
              background: "var(--border-light)",
            }} />
          ))}
        </div>
        <div style={{
          flex: 1, padding: "5px 14px", borderRadius: 6,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          fontSize: 11.5, color: "var(--text-muted)",
        }}>{url}</div>
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Builder Preview ─────────────────────────────────────────────────────────

function BuilderPreview({ progress, mobile }) {
  const sb = progress >= 2;
  const sv = progress >= 4;
  const st = progress >= 6;
  const sw = progress >= 8;
  const sf = progress >= 10;
  const px = mobile ? 24 : 48;

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: `32px ${px}px 48px`,
      background: "var(--bg)",
    }}>
      {/* Status */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 32,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: sf ? "var(--success)" : "var(--accent)",
            boxShadow: sf ? "0 0 8px rgba(22,163,74,0.4)" : "0 0 6px var(--accent-glow)",
            animation: sf ? "glow 2s ease-in-out infinite" : "pulse 2.5s ease-in-out infinite",
          }} />
          <span style={{
            fontSize: 11, color: sf ? "var(--success)" : "var(--text-muted)",
            fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
          }}>{sf ? "Preview Ready" : "Building..."}</span>
        </div>
        <span style={{
          fontSize: 10, color: "var(--text-muted)",
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>Live Preview</span>
      </div>

      {/* Empty */}
      {!sb && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", height: "55%", textAlign: "center",
          animation: "fadeIn 0.8s ease-out",
        }}>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 40,
            marginBottom: 16, opacity: 0.15, color: "var(--text-muted)",
          }}>✦</div>
          <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 260, lineHeight: 1.7 }}>
            Describe your event and watch it take shape.
          </p>
        </div>
      )}

      {/* Event page */}
      {sb && (
        <div style={{ animation: "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          {/* Header */}
          <div style={{ marginBottom: sv ? 44 : 28 }}>
            <div style={{
              display: "inline-block", padding: "5px 12px", borderRadius: 5,
              background: "var(--accent-soft)", color: "var(--accent)",
              fontSize: 11, fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: 16,
            }}>Mar 14–15, 2026 · Detroit</div>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: mobile ? (sv ? 40 : 32) : (sv ? 72 : 52),
              fontWeight: sv ? 400 : 300,
              letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 14,
              color: "var(--text-primary)",
              transition: "font-size 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>Kaleidoscope</h1>

            <p style={{
              fontSize: mobile ? 14 : 18, color: "var(--text-secondary)",
              lineHeight: 1.65, maxWidth: 520,
            }}>
              {sv
                ? "Two days of raw creative energy. Designers, developers, and founders colliding in a warehouse in downtown Detroit."
                : "A 2-day creative conference for designers, developers, and founders."}
            </p>
          </div>

          {/* Tags */}
          {sv && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 44,
              animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}>
              {["Indie Creative", "Warehouse Venue", "Interactive"].map((t, i) => (
                <span key={i} style={{
                  padding: "6px 14px", borderRadius: 20,
                  border: "1px solid var(--border)",
                  fontSize: 12, color: "var(--text-secondary)", fontWeight: 500,
                  background: "var(--bg-card)",
                }}>{t}</span>
              ))}
            </div>
          )}

          {/* Divider */}
          {sv && (
            <div style={{
              height: 1, marginBottom: 44,
              background: "linear-gradient(90deg, var(--accent), var(--purple), transparent)",
              opacity: 0.12,
            }} />
          )}

          {/* Tickets */}
          {st && (
            <div style={{
              animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
              marginBottom: 44,
            }}>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: mobile ? 20 : 26, fontWeight: 400,
                letterSpacing: "-0.02em", marginBottom: 20,
              }}>Choose Your Experience</h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
                gap: 12,
              }}>
                {[
                  { name: "General", price: "$149", color: "var(--text-muted)", perks: ["2-day conference access", "Community events", "Lunch included"] },
                  { name: "Creator", price: "$299", color: "var(--accent)", perks: ["Everything in General", "Workshop access", "Creator lounge"], featured: true },
                  { name: "VIP", price: "$499", color: "var(--purple)", perks: ["Everything in Creator", "Speaker dinner", "Front row seating"] },
                ].map((tier, i) => (
                  <div key={i} style={{
                    padding: mobile ? 18 : 24, borderRadius: "var(--r)",
                    background: "var(--bg-card)",
                    border: `1px solid ${tier.featured ? tier.color + "30" : "var(--border)"}`,
                    boxShadow: tier.featured ? "var(--shadow)" : "var(--shadow-sm)",
                    position: "relative", overflow: "hidden",
                    animation: `fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both`,
                  }}>
                    {tier.featured && (
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 2,
                        background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)`,
                        opacity: 0.5,
                      }} />
                    )}

                    <div style={{ marginBottom: mobile ? 12 : 20 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 600, color: tier.color,
                        letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6,
                      }}>{tier.name}</div>
                      <div style={{
                        fontFamily: "var(--font-display)",
                        fontSize: mobile ? 28 : 36, fontWeight: 300, letterSpacing: "-0.02em",
                      }}>{tier.price}</div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {tier.perks.map((p, j) => (
                        <div key={j} style={{
                          fontSize: 13, color: "var(--text-secondary)",
                          display: "flex", alignItems: "center", gap: 10,
                        }}>
                          <span style={{
                            width: 4, height: 4, borderRadius: "50%",
                            background: tier.color, flexShrink: 0, opacity: 0.6,
                          }} />
                          {p}
                        </div>
                      ))}
                    </div>

                    {sw && tier.name === "Creator" && (
                      <div style={{
                        marginTop: 16, paddingTop: 16,
                        borderTop: "1px solid var(--border)",
                        animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}>
                        <div style={{
                          fontSize: 10, fontWeight: 600, color: "var(--text-muted)",
                          textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10,
                        }}>Select Workshop</div>
                        {["Design Systems at Scale", "AI-Native Products", "Founding Your Studio"].map((w, k) => (
                          <label key={k} style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "6px 0", fontSize: 13,
                            color: k === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                            cursor: "pointer",
                          }}>
                            <div style={{
                              width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                              border: k === 0 ? "2px solid var(--accent)" : "1.5px solid var(--border-light)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
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

          {/* Publish */}
          {sf && (
            <div style={{
              display: "flex", flexDirection: mobile ? "column" : "row",
              alignItems: mobile ? "stretch" : "center",
              justifyContent: "space-between", gap: 16,
              padding: mobile ? 20 : 24, borderRadius: "var(--r)",
              background: "var(--accent-soft)", border: "1px solid var(--accent-glow)",
              animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>Ready to go live?</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Your event page is looking great.</div>
              </div>
              <button style={{
                padding: "12px 28px", borderRadius: "var(--r-sm)", flexShrink: 0,
                background: "var(--accent)", border: "none", color: "#fff",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>Publish Event →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Checkout Receipt ────────────────────────────────────────────────────────

function CheckoutReceipt({ progress, mobile }) {
  const showTeam = progress >= 2;
  const showTiers = progress >= 4;
  const showWs = progress >= 6;
  const px = mobile ? 24 : 48;
  const items = showTiers
    ? [{ label: "VIP × 1 — You", price: 499 }, { label: "Creator × 3", price: 897 }]
    : [];
  const total = items.reduce((s, l) => s + l.price, 0);

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: `32px ${px}px 48px`,
      background: "var(--bg)", display: "flex", flexDirection: "column",
    }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          display: "inline-block", padding: "5px 12px", borderRadius: 5,
          background: "var(--purple-soft)", color: "var(--purple)",
          fontSize: 11, fontWeight: 600,
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16,
        }}>Registration</div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: mobile ? 28 : 38, fontWeight: 300,
          letterSpacing: "-0.03em", marginBottom: 6,
        }}>Kaleidoscope 2026</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Mar 14–15 · Detroit, MI</p>
      </div>

      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--r)", padding: mobile ? 20 : 28,
        boxShadow: "var(--shadow)",
        flex: 1, display: "flex", flexDirection: "column",
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, color: "var(--text-muted)",
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12,
          }}>Attendees</div>

          {showTeam ? (
            <div style={{
              display: "flex", flexDirection: "column", gap: 8,
              animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              {[
                { name: "You", tier: showTiers ? "VIP" : "—", color: "var(--purple)", ws: null },
                { name: "Sarah", tier: showTiers ? "Creator" : "—", color: "var(--accent)", ws: showWs ? "Design Systems at Scale" : null },
                { name: "Mike", tier: showTiers ? "Creator" : "—", color: "var(--accent)", ws: showWs ? "AI-Native Products" : null },
                { name: "Priya", tier: showTiers ? "Creator" : "—", color: "var(--accent)", ws: showWs ? "Founding Your Studio" : null },
              ].map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", borderRadius: "var(--r-xs)",
                  background: "var(--bg)", border: "1px solid var(--border)",
                  animation: `fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s both`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: a.color === "var(--purple)" ? "var(--purple-soft)" : "var(--accent-soft)",
                      border: `1px solid ${a.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 600, color: a.color,
                    }}>{a.name[0]}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                      {a.ws && (
                        <div style={{
                          fontSize: 11, color: "var(--text-muted)",
                          overflow: "hidden", textOverflow: "ellipsis",
                          whiteSpace: "nowrap", marginTop: 1,
                        }}>{a.ws}</div>
                      )}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: a.color, flexShrink: 0,
                    padding: "3px 10px", borderRadius: 5,
                    background: a.color === "var(--purple)" ? "var(--purple-soft)" : "var(--accent-soft)",
                  }}>{a.tier}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: 20, borderRadius: "var(--r-xs)",
              border: "1px dashed var(--border)",
              textAlign: "center", color: "var(--text-muted)", fontSize: 13,
            }}>Attendees will appear as you add them</div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {showTiers && (
          <div style={{
            borderTop: "1px solid var(--border)", paddingTop: 20,
            animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            <div style={{
              fontSize: 10, fontWeight: 600, color: "var(--text-muted)",
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12,
            }}>Summary</div>

            {items.map((it, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0", fontSize: 14,
              }}>
                <span style={{ color: "var(--text-secondary)" }}>{it.label}</span>
                <span style={{ fontWeight: 500, fontFamily: "var(--font-display)" }}>${it.price}</span>
              </div>
            ))}

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 0 0", marginTop: 12,
              borderTop: "1px solid var(--border)",
            }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Total</span>
              <span style={{
                fontFamily: "var(--font-display)", fontSize: 28,
                fontWeight: 300, color: "var(--purple)", letterSpacing: "-0.02em",
              }}>${total.toLocaleString()}</span>
            </div>

            <button style={{
              width: "100%", marginTop: 20, padding: "14px 24px",
              borderRadius: "var(--r-sm)", background: "var(--purple)",
              border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>Complete Registration →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const mobile = useIsMobile();
  const [page, setPage] = useState("home");
  const [mode, setMode] = useState("builder");
  const [bp, setBp] = useState(0);
  const [cp, setCp] = useState(0);
  const [panel, setPanel] = useState("chat");

  function openDemo(m) {
    setMode(m);
    setPanel("chat");
    setBp(0);
    setCp(0);
    setPage("demo");
  }

  if (page === "home") {
    return (
      <>
        <style>{STYLES}</style>
        <Homepage onOpenDemo={openDemo} mobile={mobile} />
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div style={{
        width: "100vw", height: "100vh",
        display: "flex", flexDirection: "column",
        background: "var(--bg)",
        fontFamily: "var(--font-body)", color: "var(--text-primary)",
        overflow: "hidden",
        animation: "fadeIn 0.4s ease-out",
      }}>

        {/* Nav */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: mobile ? "0 14px" : "0 24px",
          height: 50, flexShrink: 0,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-card)",
        }}>
          {/* Back */}
          <button
            onClick={() => setPage("home")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "none", cursor: "pointer",
              minWidth: mobile ? 50 : 120,
              padding: 0,
            }}
          >
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>←</span>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 500,
              background: "linear-gradient(135deg, var(--accent), var(--purple))",
              WebkitBackgroundClip: "text", color: "transparent",
            }}>tkt</span>
          </button>

          {/* Mode Switcher */}
          <div style={{
            display: "flex",
            background: "var(--bg-elevated)", borderRadius: "var(--r-sm)",
            padding: 3, border: "1px solid var(--border)",
          }}>
            {[
              { id: "builder", label: mobile ? "Build" : "Event Builder" },
              { id: "checkout", label: "Checkout" },
            ].map(tab => (
              <button key={tab.id} onClick={() => { setMode(tab.id); setPanel("chat"); }} style={{
                padding: mobile ? "6px 14px" : "7px 18px",
                borderRadius: "var(--r-xs)",
                border: "none", cursor: "pointer",
                fontSize: 12.5, fontWeight: 500,
                background: mode === tab.id ? "var(--bg-card)" : "transparent",
                color: mode === tab.id ? "var(--text-primary)" : "var(--text-muted)",
                boxShadow: mode === tab.id ? "var(--shadow-sm)" : "none",
                transition: "all 0.25s ease",
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Right */}
          <div style={{ minWidth: mobile ? 50 : 120, display: "flex", justifyContent: "flex-end" }}>
            {!mobile && <RequestButton />}
          </div>
        </div>

        {/* Mobile Toggle */}
        {mobile && (
          <div style={{
            display: "flex", background: "var(--bg-elevated)",
            borderBottom: "1px solid var(--border)", padding: 6, flexShrink: 0,
          }}>
            {[
              { id: "preview", label: mode === "builder" ? "Preview" : "Receipt" },
              { id: "chat", label: "Chat" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setPanel(tab.id)} style={{
                flex: 1, padding: "8px 0", borderRadius: "var(--r-xs)",
                border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 500,
                background: panel === tab.id ? "var(--bg-card)" : "transparent",
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
                ? <BuilderPreview progress={bp} mobile />
                : <CheckoutReceipt progress={cp} mobile />
            ) : (
              mode === "builder"
                ? <Chat convo={builderConvo} onProgress={setBp} title="Event Builder" sub="Describe your vision" accent="var(--accent)" />
                : <Chat convo={checkoutConvo} onProgress={setCp} title="Registration" sub="Kaleidoscope 2026" accent="var(--purple)" />
            )
          ) : (
            <>
              <BrowserFrame url={mode === "builder" ? "kaleidoscope.tkt.events" : "checkout.tkt.events/register"}>
                {mode === "builder"
                  ? <BuilderPreview progress={bp} mobile={false} />
                  : <CheckoutReceipt progress={cp} mobile={false} />}
              </BrowserFrame>
              <div style={{ width: 390, flexShrink: 0, borderLeft: "1px solid var(--border)" }}>
                {mode === "builder"
                  ? <Chat convo={builderConvo} onProgress={setBp} title="Event Builder" sub="Describe your vision" accent="var(--accent)" />
                  : <Chat convo={checkoutConvo} onProgress={setCp} title="Registration" sub="Kaleidoscope 2026" accent="var(--purple)" />}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
