import React from "react";
import { GoldText } from "../components/GoldText";
import { LogoMark } from "../components/Logo";
import { C, CAPTION_TOP, CX, GOLD_GRADIENT, SANS, SERIF } from "../theme";
import { VO, line, prog, ws } from "../timing";

const Tap: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const p = prog(t, at, 0.5);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 120,
        height: 120,
        marginLeft: -60,
        marginTop: -60,
        borderRadius: "50%",
        border: `3px solid ${C.goldLight}`,
        transform: `scale(${0.3 + p * 1.6})`,
        opacity: 1 - p,
      }}
    />
  );
};

const press = (t: number, at: number) => 1 - 0.07 * Math.sin(Math.min(1, Math.max(0, (t - at) / 0.22)) * Math.PI);

/** Line 5 and the end card: follow and DM. */
export const Cta: React.FC<{ t: number }> = ({ t }) => {
  const a = line(5).start;
  const tF = ws(5, 0) + 0.12;
  const tDM = ws(5, 4) + 0.08;
  const followed = t >= tF + 0.12;
  const bubble = prog(t, tDM + 0.25, 0.4);
  const ending = prog(t, VO.speechEnd + 0.35, 0.7);
  const intro = prog(t, a - 0.2, 0.5);

  const btn: React.CSSProperties = {
    position: "relative",
    width: 300,
    height: 100,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    fontFamily: SANS,
    fontWeight: 800,
    fontSize: 34,
  };

  return (
    <>
      <div style={{ position: "absolute", left: CX - 120, top: 290, opacity: intro, transform: `scale(${0.9 + 0.1 * intro})` }}>
        <LogoMark size={240} spin={t * 18} />
      </div>
      <div style={{ position: "absolute", left: CX - 420, width: 840, top: 570, textAlign: "center", opacity: intro }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, color: C.ivory, letterSpacing: "-0.01em" }}>@gergis.motion</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 29, color: C.muted, marginTop: 10 }}>Motion graphics · Promo videos · Websites</div>
      </div>

      <div style={{ position: "absolute", left: CX - 312, top: 780, display: "flex", gap: 24, opacity: intro }}>
        <div
          style={{
            ...btn,
            background: followed ? "#17140f" : GOLD_GRADIENT,
            color: followed ? C.gold : "#1a140a",
            border: followed ? `2px solid ${C.gold}` : "2px solid transparent",
            transform: `scale(${press(t, tF)})`,
          }}
        >
          {followed ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1a140a" strokeWidth="2.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          )}
          {followed ? "Following" : "Follow"}
          <Tap t={t} at={tF} />
        </div>
        <div
          style={{
            ...btn,
            background: t >= tDM + 0.1 ? GOLD_GRADIENT : "transparent",
            color: t >= tDM + 0.1 ? "#1a140a" : C.ivory,
            border: `2px solid ${t >= tDM + 0.1 ? "transparent" : C.line}`,
            transform: `scale(${press(t, tDM)})`,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><path d="M4 5h16v11H9l-5 4z" /></svg>
          Message
          <Tap t={t} at={tDM} />
        </div>
      </div>

      {/* DM preview */}
      <div
        style={{
          position: "absolute",
          left: CX - 300,
          top: 930,
          width: 600,
          padding: "22px 28px",
          borderRadius: "28px 28px 28px 8px",
          background: "rgba(26,23,18,.95)",
          border: `1.5px solid ${C.line}`,
          opacity: bubble,
          transform: `translateY(${(1 - bubble) * 26}px)`,
          fontFamily: SANS,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,.85)",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 19, letterSpacing: "0.18em", color: C.gold }}>NEW MESSAGE</div>
        <div style={{ fontWeight: 700, fontSize: 31, color: C.ivory, marginTop: 8 }}>Hi! I'd like to start a project.</div>
      </div>

      {/* end card line, replaces the captions after the voice ends */}
      <div style={{ position: "absolute", left: CX - 420, width: 840, top: CAPTION_TOP - 10, textAlign: "center", fontFamily: SERIF, lineHeight: 0.98, opacity: ending, transform: `translateY(${(1 - ending) * 30}px)` }}>
        <div style={{ fontSize: 96, color: C.ivory, fontWeight: 400 }}>Let's make it</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: -6 }}>
          <GoldText text="move." size={132} width={500} italic />
        </div>
      </div>
    </>
  );
};
