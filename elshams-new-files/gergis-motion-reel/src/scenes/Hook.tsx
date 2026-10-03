import React from "react";
import { GoldText } from "../components/GoldText";
import { C, CX, SANS, SERIF } from "../theme";
import { MUSIC, lerpT, prog, ws } from "../timing";

const tc = (s: number) => {
  const f = Math.floor((s % 1) * 30);
  const sec = Math.floor(s);
  return `00:00:${String(sec).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

/** Line 1: "Your business deserves to move." A paused frame that starts playing on "move". */
export const Hook: React.FC<{ t: number }> = ({ t }) => {
  const tm = ws(1, 4);
  const playing = prog(t, tm - 0.05, 0.4);
  const punch = Math.sin(Math.min(1, Math.max(0, (t - tm) / 0.35)) * Math.PI) * 0.045;
  const elapsed = Math.max(0, t - tm);

  // each word slams in on its thump
  const word = (i: number) => {
    const p = prog(t, ws(1, i) - 0.04, 0.2);
    return { opacity: Math.min(1, p * 2), transform: `scale(${1.7 - 0.7 * p})`, display: "inline-block", filter: `blur(${(1 - p) * 10}px)` };
  };
  // the card zooms in from the very first frame, and stutters like a stuck video
  const intro = lerpT(t, 0, 0.8, 1.12, 1);
  const g = MUSIC.glitches.some((x) => t >= x && t < x + 0.09);
  const gx = g ? Math.sin(t * 997) * 14 : 0;
  const label = t < tm;
  const pm = prog(t, tm - 0.06, 0.55);
  const drift = elapsed > 0 ? Math.sin(elapsed * 2.2) * 6 : 0;

  return (
    <>
      <div style={{ position: "absolute", left: CX - 290, width: 580, top: 248, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: "0.3em", color: label ? C.muted : C.gold }}>
        {label ? "YOUR BUSINESS RIGHT NOW" : "WITH GERGIS MOTION"}
      </div>
      {/* the "paused" frame */}
      <div
        style={{
          position: "absolute",
          left: CX - 290,
          top: 300,
          width: 580,
          height: 360,
          borderRadius: 26,
          border: `1.5px solid ${C.line}`,
          background: "linear-gradient(160deg, #1d1912, #0f0d0a)",
          overflow: "hidden",
          transform: `translateX(${gx}px) scale(${intro + punch}) rotate(${-punch * 20}deg)`,
          filter: g ? "drop-shadow(8px 0 rgba(255,40,80,.75)) drop-shadow(-8px 0 rgba(0,220,255,.75))" : undefined,
          boxShadow: `0 40px 90px -30px rgba(0,0,0,.8), 0 0 ${60 * playing}px rgba(212,180,122,${0.18 * playing})`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${30 + elapsed * 18}% 30%, rgba(212,180,122,${0.08 + 0.18 * playing}), transparent 60%)` }} />
        <div style={{ position: "absolute", top: 24, left: 26, display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "0.24em", color: C.muted }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: playing > 0.5 ? "#E5484D" : C.dim, boxShadow: playing > 0.5 ? "0 0 14px #E5484D" : "none" }} />
          {playing > 0.5 ? "PLAYING" : "PAUSED"}
        </div>
        {/* pause bars morph into a play triangle */}
        <div style={{ position: "absolute", left: "50%", top: "46%", width: 132, height: 132, marginLeft: -66, marginTop: -66, borderRadius: 66, border: `2px solid ${C.gold}`, display: "grid", placeItems: "center", transform: `rotate(${playing * 90}deg) scale(${1 - 0.1 * Math.sin(playing * Math.PI)})` }}>
          <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: "absolute", opacity: 1 - playing }}>
            <rect x="12" y="8" width="11" height="40" rx="2" fill={C.gold} />
            <rect x="33" y="8" width="11" height="40" rx="2" fill={C.gold} />
          </svg>
          <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: "absolute", opacity: playing, transform: "rotate(-90deg)" }}>
            <path d="M17 8 L48 28 L17 48 Z" fill={C.gold} />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 26, right: 26, bottom: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 700, fontSize: 19, color: C.gold, letterSpacing: "0.08em", marginBottom: 12 }}>
            <span>{tc(elapsed)}</span>
            <span style={{ color: C.dim }}>1080 × 1920</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: "rgba(244,239,230,.1)" }}>
            <div style={{ height: 4, borderRadius: 2, width: `${Math.min(100, elapsed * 9)}%`, background: C.gold }} />
          </div>
        </div>
      </div>

      {/* the line itself, set large */}
      <div style={{ position: "absolute", left: CX - 430, width: 860, top: 760, textAlign: "center", fontFamily: SERIF, color: C.ivory, lineHeight: 0.96 }}>
        <div style={{ fontSize: 116, fontWeight: 400, letterSpacing: "-0.02em" }}>
          <span style={word(0)}>Your</span> <span style={word(1)}>business</span>
        </div>
        <div style={{ fontSize: 116, fontWeight: 400, letterSpacing: "-0.02em" }}>
          <span style={word(2)}>deserves</span> <span style={word(3)}>to</span>
        </div>
        <div style={{ position: "relative", height: 210 }}>
          {[3, 2, 1].map((k) => (
            <span
              key={k}
              style={{
                position: "absolute",
                left: "50%",
                transform: `translateX(calc(-50% + ${lerpT(t, tm - 0.06, tm + 0.5, -260, 0) - k * 46 * (1 - pm) + drift}px))`,
                top: 0,
                fontSize: 212,
                fontStyle: "italic",
                fontWeight: 500,
                color: C.gold,
                opacity: pm * (0.22 / k) * (1 - pm * 0.85),
                letterSpacing: "-0.03em",
              }}
            >
              move.
            </span>
          ))}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: -10,
              opacity: pm,
              transform: `translateX(calc(-50% + ${lerpT(t, tm - 0.06, tm + 0.5, -260, 0) + drift}px)) skewX(${(1 - pm) * -14}deg)`,
              filter: `blur(${(1 - pm) * 6}px)`,
            }}
          >
            <GoldText text="move." size={212} width={620} italic tracking={-0.03} sheen={lerpT(t, tm + 0.15, tm + 1.6, -20, 130)} />
          </div>
        </div>
      </div>
    </>
  );
};
