import React from "react";
import { Img, staticFile } from "remotion";
import { C, CX, SANS } from "../theme";
import { easeInOut, lerpT, lineEnd, prog, ws } from "../timing";

const Eyebrow: React.FC<{ label: string; index: number; t: number; a: number }> = ({ label, index, t, a }) => {
  const p = prog(t, a, 0.35);
  return (
    <div style={{ position: "absolute", top: 250, left: CX - 400, width: 800, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: p }}>
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: "0.3em", color: C.gold }}>{label}</span>
      <span style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: i === index ? 34 : 12, height: 12, borderRadius: 6, background: i === index ? C.gold : "rgba(244,239,230,.18)" }} />
        ))}
      </span>
    </div>
  );
};

/** Slide a panel in from the right at `a` and out to the left at `b`. */
const Panel: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => {
  if (t < a - 0.25 || t > b + 0.05) return null;
  const pin = prog(t, a - 0.2, 0.45);
  const pout = prog(t, b - 0.22, 0.25, easeInOut);
  const x = (1 - pin) * 300 - pout * 340;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: pin * (1 - pout), transform: `translateX(${x}px)`, filter: `blur(${(1 - pin) * 8 + pout * 10}px)` }}>
      {children}
    </div>
  );
};

const Dots = () => (
  <div style={{ display: "flex", gap: 9 }}>
    {["#5a3b30", "#5a4c30", "#3a4a30"].map((c) => (
      <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
    ))}
  </div>
);

/** After Effects style graph: a gold dot eases along a drawn motion path. */
const MotionPanel: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const P0 = [90, 520], P1 = [210, 90], P2 = [560, 600], P3 = [720, 150];
  const bez = (u: number) => {
    const m = 1 - u;
    return [0, 1].map((k) => m * m * m * P0[k] + 3 * m * m * u * P1[k] + 3 * m * u * u * P2[k] + u * u * u * P3[k]);
  };
  const path = `M${P0} C${P1} ${P2} ${P3}`;
  const drawn = prog(t, a - 0.1, 0.7);
  const u = (tt: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, tt - a - 0.15) / 0.8);
  const ball = bez(u(t));
  return (
    <div style={{ position: "absolute", left: CX - 410, top: 330, width: 820, height: 780, borderRadius: 26, border: `1.5px solid ${C.line}`, background: "#0e0c0a", overflow: "hidden", boxShadow: "0 50px 100px -40px rgba(0,0,0,.9)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 26px", borderBottom: `1px solid ${C.lineSoft}`, background: "#13110d" }}>
        <Dots />
        <span style={{ flex: 1, fontFamily: SANS, fontWeight: 600, fontSize: 22, color: C.muted }}>Logo_Reveal.aep · Graph Editor</span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.gold }}>{`00:00:0${Math.floor(u(t) * 2)}:${String(Math.floor(u(t) * 59)).padStart(2, "0")}`}</span>
      </div>
      <svg width="820" height="700" viewBox="0 0 820 700" style={{ position: "absolute", top: 70 }}>
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="700" stroke="rgba(244,239,230,.05)" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 60} x2="820" y2={i * 60} stroke="rgba(244,239,230,.05)" />
        ))}
        <path d={`M${P0} L${P1}`} stroke={C.dim} strokeWidth="2" strokeDasharray="6 6" opacity={drawn} />
        <path d={`M${P3} L${P2}`} stroke={C.dim} strokeWidth="2" strokeDasharray="6 6" opacity={drawn} />
        <circle cx={P1[0]} cy={P1[1]} r="9" fill={C.surface} stroke={C.muted} strokeWidth="2" opacity={drawn} />
        <circle cx={P2[0]} cy={P2[1]} r="9" fill={C.surface} stroke={C.muted} strokeWidth="2" opacity={drawn} />
        <path d={path} fill="none" stroke={C.gold} strokeWidth="4" strokeDasharray="1100" strokeDashoffset={1100 * (1 - drawn)} strokeLinecap="round" />
        {[P0, P3].map((p, i) => (
          <rect key={i} x={p[0] - 13} y={p[1] - 13} width="26" height="26" transform={`rotate(45 ${p[0]} ${p[1]})`} fill={C.gold} opacity={drawn} />
        ))}
        {[5, 4, 3, 2, 1].map((k) => {
          const e = bez(u(t - k * 0.035));
          return <circle key={k} cx={e[0]} cy={e[1]} r={30} fill={C.gold} opacity={0.07 * (6 - k) * drawn} />;
        })}
        <circle cx={ball[0]} cy={ball[1]} r="32" fill={C.gold} opacity={drawn} />
        <circle cx={ball[0]} cy={ball[1]} r="48" fill="none" stroke={C.goldLight} strokeOpacity={0.35 * drawn} strokeWidth="2" />
        {/* timeline strip with keyframes */}
        <rect x="40" y="600" width="740" height="4" rx="2" fill="rgba(244,239,230,.12)" />
        {[40, 300, 520, 780].map((x) => (
          <rect key={x} x={x - 9} y={593} width="18" height="18" transform={`rotate(45 ${x} 602)`} fill={C.goldDeep} />
        ))}
        <rect x={40 + u(t) * 740 - 2} y="570" width="4" height="64" fill={C.gold} />
      </svg>
    </div>
  );
};

/** A phone playing a promo cut of a real website. */
const PromoPanel: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const local = t - a;
  const shots = ["img/elshams-home-mobile.webp", "img/elshams-dyeing-mobile.webp"];
  const cut = local < 0.75 ? 0 : 1;
  const within = cut === 0 ? local : local - 0.75;
  const zoom = 1.04 + within * 0.06;
  const sticker = prog(t, a + 0.35, 0.35);
  return (
    <>
      <div style={{ position: "absolute", left: CX - 205, top: 330, width: 410, height: 800, borderRadius: 58, padding: 14, background: "#16130e", border: `2px solid ${C.line}`, boxShadow: "0 60px 120px -40px rgba(0,0,0,.9), 0 0 80px rgba(212,180,122,.12)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 46, overflow: "hidden", background: "#000" }}>
          <Img src={staticFile(shots[cut])} style={{ position: "absolute", width: "100%", top: 0, transform: `scale(${zoom})`, transformOrigin: "50% 20%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.35), transparent 25%, transparent 70%, rgba(0,0,0,.6))" }} />
          <div style={{ position: "absolute", top: 26, left: 24, display: "flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 800, fontSize: 17, letterSpacing: "0.18em", color: C.ivory }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#E5484D", boxShadow: "0 0 12px #E5484D" }} /> PROMO EDIT
          </div>
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 30 }}>
            <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,.25)" }}>
              <div style={{ height: 5, borderRadius: 3, width: `${Math.min(100, 8 + local * 40)}%`, background: C.gold }} />
            </div>
          </div>
          {/* hard cut flash */}
          <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(0, 1 - Math.abs(local - 0.75) / 0.06) * 0.5 }} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: CX + 90,
          top: 470,
          padding: "16px 26px",
          borderRadius: 999,
          background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold} 50%, ${C.goldDeep})`,
          color: "#1a140a",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: "0.12em",
          transform: `rotate(-6deg) scale(${sticker})`,
          boxShadow: "0 20px 40px -12px rgba(0,0,0,.7)",
        }}
      >
        NEW WEBSITE
      </div>
    </>
  );
};

/** A browser that builds from wireframe to a real, scrolling site. */
const WebPanel: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const real = prog(t, a + 0.25, 0.45);
  const scroll = lerpT(t, a + 0.5, b, 0, -620, easeInOut);
  const phoneIn = prog(t, ws(3, 6) - 0.05, 0.5);
  const bw = 840;
  return (
    <>
      <div style={{ position: "absolute", left: CX - bw / 2, top: 350, width: bw, height: 600, borderRadius: 22, border: `1.5px solid ${C.line}`, background: "#13110d", overflow: "hidden", boxShadow: "0 60px 120px -40px rgba(0,0,0,.9)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 20px", borderBottom: `1px solid ${C.lineSoft}`, background: "#1b1813" }}>
          <Dots />
          <span style={{ flex: 1, padding: "8px 16px", borderRadius: 10, background: "rgba(244,239,230,.06)", fontFamily: SANS, fontWeight: 600, fontSize: 19, color: C.muted }}>
            elshams.org
          </span>
        </div>
        <div style={{ position: "relative", height: 540, overflow: "hidden" }}>
          {/* wireframe */}
          <div style={{ position: "absolute", inset: 0, padding: 34, opacity: 1 - real }}>
            <div style={{ width: 200, height: 22, borderRadius: 6, background: "rgba(212,180,122,.35)" }} />
            <div style={{ marginTop: 50, width: 520, height: 46, borderRadius: 8, background: "rgba(244,239,230,.14)" }} />
            <div style={{ marginTop: 16, width: 380, height: 46, borderRadius: 8, background: "rgba(244,239,230,.14)" }} />
            <div style={{ marginTop: 30, width: 150, height: 44, borderRadius: 22, background: "rgba(212,180,122,.45)" }} />
            <div style={{ marginTop: 50, display: "flex", gap: 18 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ flex: 1, height: 150, borderRadius: 12, border: "1.5px dashed rgba(244,239,230,.2)" }} />
              ))}
            </div>
          </div>
          <Img src={staticFile("img/elshams-home.webp")} style={{ position: "absolute", left: 0, top: scroll, width: bw, opacity: real }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: CX + 210, top: 760, width: 196, height: 392, borderRadius: 30, padding: 8, background: "#16130e", border: `2px solid ${C.line}`, opacity: phoneIn, transform: `translateY(${(1 - phoneIn) * 80}px)`, boxShadow: "0 40px 80px -20px rgba(0,0,0,.9)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 23, overflow: "hidden" }}>
          <Img src={staticFile("img/elshams-home-mobile.webp")} style={{ width: "100%" }} />
        </div>
      </div>
    </>
  );
};

/** Line 3: the three services, one panel per phrase. */
export const Services: React.FC<{ t: number }> = ({ t }) => {
  const p0 = ws(3, 0), p1 = ws(3, 2), p2 = ws(3, 5), end = lineEnd(3);
  return (
    <>
      <Panel t={t} a={p0} b={p1 - 0.05}>
        <Eyebrow label="MOTION GRAPHICS" index={0} t={t} a={p0 - 0.1} />
        <MotionPanel t={t} a={p0} />
      </Panel>
      <Panel t={t} a={p1} b={p2 - 0.05}>
        <Eyebrow label="WEBSITE PROMO VIDEOS" index={1} t={t} a={p1 - 0.1} />
        <PromoPanel t={t} a={p1} />
      </Panel>
      <Panel t={t} a={p2} b={end + 0.4}>
        <Eyebrow label="MODERN WEBSITES" index={2} t={t} a={p2 - 0.1} />
        <WebPanel t={t} a={p2} b={end} />
      </Panel>
    </>
  );
};
