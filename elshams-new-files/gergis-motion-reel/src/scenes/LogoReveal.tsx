import React from "react";
import { GoldText } from "../components/GoldText";
import { LogoMark } from "../components/Logo";
import { C, CX, SANS, SERIF } from "../theme";
import { lerpT, line, prog, ws } from "../timing";

/** Line 2: "I'm Gergis, and this is Gergis Motion." The GM mark draws, then the name lands. */
export const LogoReveal: React.FC<{ t: number }> = ({ t }) => {
  const a = line(2).start;
  const land = ws(2, 5);
  const size = 380;
  const draw = prog(t, a - 0.1, 1.1);
  const letters = prog(t, ws(2, 1), 0.55);
  const ring = prog(t, ws(2, 1) + 0.1, 0.7);
  const name = prog(t, land - 0.08, 0.7);
  const glow = Math.max(0, 1 - Math.abs(t - land - 0.1) / 0.6);
  const tracking = lerpT(t, land - 0.08, land + 0.9, 0.42, 0.16);
  const sheen = lerpT(t, land + 0.1, land + 1.4, 130, -30);
  const sub = prog(t, ws(2, 6) + 0.15, 0.6);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: CX - 360,
          top: 120,
          width: 720,
          height: 720,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(212,180,122,${0.1 + glow * 0.22}), transparent 62%)`,
        }}
      />
      <div style={{ position: "absolute", left: CX - size / 2, top: 290, transform: `scale(${1 + glow * 0.03})` }}>
        <LogoMark size={size} draw={draw} letters={letters} ring={ring} spin={(t - a) * 16} />
      </div>
      <div style={{ position: "absolute", left: CX - 460, width: 920, top: 730, textAlign: "center", fontFamily: SERIF, fontWeight: 500, lineHeight: 1 }}>
        <div
          style={{
            fontSize: 128,
            letterSpacing: `${tracking}em`,
            marginRight: `-${tracking}em`,
            color: C.ivory,
            opacity: name,
            transform: `translateY(${(1 - name) * 40}px)`,
            filter: `blur(${(1 - name) * 10}px)`,
          }}
        >
          GERGIS
        </div>
        <div style={{ marginTop: -4, display: "flex", justifyContent: "center", opacity: name, transform: `translateY(${(1 - name) * 60}px)`, filter: `blur(${(1 - name) * 10}px)` }}>
          <GoldText text="MOTION" size={128} width={900} tracking={tracking} sheen={sheen} />
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: "0.46em", marginRight: "-0.46em", color: C.muted, marginTop: 34, opacity: sub }}>
          BY GERGIS SHAWKY
        </div>
      </div>
    </>
  );
};
