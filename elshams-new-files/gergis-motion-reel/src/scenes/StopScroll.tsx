import React from "react";
import { spring } from "remotion";
import { LogoMark } from "../components/Logo";
import { C, CX, FPS, SANS, SERIF } from "../theme";
import { line, prog, ws } from "../timing";

const CARD_W = 640;
const CARD_H = 560;
const PITCH = CARD_H + 36;
const TARGET = 6; // index of the Gergis Motion card in the feed
const CENTER_Y = 600; // where the stopped card's center lands

const FeedCard: React.FC = () => (
  <div style={{ width: CARD_W, height: CARD_H, borderRadius: 30, background: "#15120e", border: `1px solid ${C.lineSoft}`, padding: 30, boxSizing: "border-box" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(244,239,230,.1)" }} />
      <div>
        <div style={{ width: 180, height: 16, borderRadius: 8, background: "rgba(244,239,230,.13)" }} />
        <div style={{ width: 110, height: 12, borderRadius: 6, background: "rgba(244,239,230,.07)", marginTop: 10 }} />
      </div>
    </div>
    <div style={{ marginTop: 26, height: 330, borderRadius: 18, background: "linear-gradient(160deg, rgba(244,239,230,.07), rgba(244,239,230,.03))" }} />
    <div style={{ marginTop: 22, width: "70%", height: 14, borderRadius: 7, background: "rgba(244,239,230,.08)" }} />
    <div style={{ marginTop: 12, width: "45%", height: 14, borderRadius: 7, background: "rgba(244,239,230,.06)" }} />
  </div>
);

const BrandCard: React.FC<{ glow: number; t: number }> = ({ glow, t }) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      borderRadius: 30,
      background: "radial-gradient(500px 400px at 50% 30%, rgba(212,180,122,.20), transparent 70%), #17140f",
      border: `2px solid rgba(212,180,122,${0.35 + 0.5 * glow})`,
      boxShadow: `0 0 ${90 * glow}px rgba(212,180,122,${0.35 * glow})`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 26,
    }}
  >
    <LogoMark size={190} spin={t * 20} />
    <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 60, letterSpacing: "0.16em", marginRight: "-0.16em", color: C.ivory }}>GERGIS MOTION</div>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 25, color: C.muted }}>Motion graphics · Promo videos · Websites</div>
  </div>
);

const Chip: React.FC<{ icon: React.ReactNode; text: string; p: number; x: number; y: number }> = ({ icon, text, p, x, y }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "18px 26px 18px 18px",
      borderRadius: 22,
      background: "rgba(26,23,18,.94)",
      border: `1.5px solid ${C.line}`,
      boxShadow: "0 24px 50px -16px rgba(0,0,0,.85)",
      opacity: p,
      transform: `translateY(${(1 - p) * 30}px) scale(${0.85 + 0.15 * p})`,
      fontFamily: SANS,
    }}
  >
    <div style={{ width: 54, height: 54, borderRadius: 16, background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold} 50%, ${C.goldDeep})`, display: "grid", placeItems: "center" }}>{icon}</div>
    <div>
      <div style={{ fontWeight: 800, fontSize: 27, color: C.ivory }}>{text}</div>
      <div style={{ fontWeight: 600, fontSize: 18, color: C.muted, marginTop: 3 }}>now</div>
    </div>
  </div>
);

const ink = "#1a140a";
const IconMsg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="2.2" strokeLinejoin="round"><path d="M4 5h16v11H9l-5 4z" /></svg>
);
const IconUser = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round"><circle cx="10" cy="8" r="4" /><path d="M3 20c1-4 4-6 7-6s6 2 7 6M19 8v6M16 11h6" /></svg>
);
const IconBrief = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="2.2" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3M3 12h18" /></svg>
);

/** Line 4: "Made to stop the scroll and bring you customers." */
export const StopScroll: React.FC<{ t: number }> = ({ t }) => {
  const a = line(4).start;
  const ts = ws(4, 2); // "stop"
  const target = TARGET * PITCH;
  const settle = spring({ frame: Math.max(0, (t - ts) * FPS), fps: FPS, config: { damping: 11, stiffness: 140, mass: 0.7 } });
  const speed = 2700;
  const y = t < ts ? target - 160 - speed * (ts - t) : target - 160 * (1 - settle);
  const blur = t < ts ? Math.min(16, 4 + (t - a + 0.4) * 30) : Math.max(0, 16 * (1 - prog(t, ts, 0.18)));
  const glow = prog(t, ts + 0.1, 0.5);

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="vblur"><feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} /></filter>
      </svg>
      <div
        style={{
          position: "absolute",
          left: CX - CARD_W / 2 - 20,
          top: 250,
          width: CARD_W + 40,
          height: 900,
          overflow: "hidden",
          WebkitMaskImage: "linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent)",
          maskImage: "linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent)",
        }}
      >
        <div style={{ position: "absolute", left: 20, top: 0, filter: blur > 0.3 ? "url(#vblur)" : undefined }}>
          {Array.from({ length: TARGET + 3 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 0, top: i * PITCH - y + (CENTER_Y - 250) - CARD_H / 2 }}>
              {i === TARGET ? <BrandCard glow={glow} t={t} /> : <FeedCard />}
            </div>
          ))}
        </div>
      </div>
      <Chip icon={<IconMsg />} text="New message" p={prog(t, ws(4, 6) - 0.05, 0.35)} x={CX - 380} y={905} />
      <Chip icon={<IconUser />} text="New follower" p={prog(t, ws(4, 7) - 0.05, 0.35)} x={CX - 40} y={992} />
      <Chip icon={<IconBrief />} text="New project" p={prog(t, ws(4, 8) - 0.05, 0.35)} x={CX - 340} y={1079} />
    </>
  );
};
