import React from "react";
import { AbsoluteFill } from "remotion";
import { prog } from "../timing";

/**
 * Scene wrapper: zooms and un-blurs in at `a`, zooms out and blurs away at `b`.
 * Outside its window the scene is not rendered at all.
 */
export const Shell: React.FC<{ t: number; a: number; b: number; noIn?: boolean; children: React.ReactNode }> = ({
  t,
  a,
  b,
  noIn,
  children,
}) => {
  if (t < a - 0.3 || t > b + 0.05) return null;
  const pin = noIn ? 1 : prog(t, a - 0.25, 0.45);
  const pout = prog(t, b - 0.28, 0.3);
  const scale = (1.06 - 0.06 * pin) * (1 - 0.05 * pout);
  const blur = (1 - pin) * 14 + pout * 12;
  return (
    <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `scale(${scale})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

/** A diagonal gold light streak that sweeps across the frame on a cut. */
export const LightSweep: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const p = prog(t, at - 0.18, 0.42);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -400,
          left: -900 + p * 2900,
          width: 520,
          height: 2800,
          transform: "rotate(18deg)",
          background: "linear-gradient(90deg, transparent, rgba(241,220,174,.0) 20%, rgba(241,220,174,.28) 50%, rgba(241,220,174,0) 80%, transparent)",
          filter: "blur(30px)",
          opacity: Math.sin(p * Math.PI),
        }}
      />
    </AbsoluteFill>
  );
};
