import React from "react";
import { GoldText } from "./GoldText";
import { C, SANS, SERIF } from "../theme";

/**
 * The GM monogram: thin gold circle, dashed outer ring, gold serif "GM".
 * draw: 0-1 how much of the circle is drawn. letters: 0-1 reveal of "GM".
 */
export const LogoMark: React.FC<{
  size: number;
  draw?: number;
  letters?: number;
  ring?: number;
  spin?: number;
}> = ({ size, draw = 1, letters = 1, ring = 1, spin = 0 }) => {
  const r = size * 0.42;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id={`gm-stroke-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.goldLight} />
            <stop offset="0.5" stopColor={C.gold} />
            <stop offset="1" stopColor={C.goldDeep} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.5 - 2}
          fill="none"
          stroke={C.gold}
          strokeOpacity={0.5 * ring}
          strokeWidth={Math.max(1.5, size * 0.006)}
          strokeDasharray={`${size * 0.022} ${size * 0.018}`}
          transform={`rotate(${spin} ${size / 2} ${size / 2})`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#gm-stroke-${size})`}
          strokeWidth={Math.max(2, size * 0.011)}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - draw)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          paddingTop: size * 0.07,
          opacity: letters,
          transform: `scale(${0.86 + 0.14 * letters})`,
          filter: `blur(${(1 - letters) * 6}px)`,
        }}
      >
        <GoldText text="GM" size={size * 0.36} width={size} tracking={0.04} />
      </div>
    </div>
  );
};

/** Small logo lockup used as a corner brand mark. */
export const LogoBug: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, opacity }}>
    <LogoMark size={52} />
    <div style={{ lineHeight: 1.1 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 25, letterSpacing: "0.16em", color: C.ivory }}>GERGIS MOTION</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 11, letterSpacing: "0.34em", color: C.muted, marginTop: 4 }}>
        BY GERGIS SHAWKY
      </div>
    </div>
  </div>
);
