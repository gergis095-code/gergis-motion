import React from "react";
import { AbsoluteFill, random } from "remotion";
import { C } from "../theme";

/** Gold sparks that burst out from (x, y) at time `at`. */
export const Burst: React.FC<{ t: number; at: number; x: number; y: number; count?: number; power?: number; seed: string }> = ({
  t,
  at,
  x,
  y,
  count = 46,
  power = 1,
  seed,
}) => {
  const d = t - at;
  if (d < 0 || d > 1.6) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const ang = random(`${seed}a${i}`) * Math.PI * 2;
        const speed = (420 + random(`${seed}s${i}`) * 900) * power;
        const drag = 1 - Math.exp(-d * 3.2);
        const dist = (speed / 3.2) * drag;
        const px = x + Math.cos(ang) * dist;
        const py = y + Math.sin(ang) * dist + 160 * d * d;
        const size = 3 + random(`${seed}z${i}`) * 7;
        const life = 0.7 + random(`${seed}l${i}`) * 0.8;
        const o = Math.max(0, 1 - d / life);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - size / 2,
              top: py - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 3 ? C.gold : C.goldLight,
              boxShadow: `0 0 ${size * 2.5}px ${C.gold}`,
              opacity: o,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** An expanding gold ring. */
export const Shockwave: React.FC<{ t: number; at: number; x: number; y: number; size?: number }> = ({ t, at, x, y, size = 1300 }) => {
  const d = t - at;
  if (d < 0 || d > 0.8) return null;
  const p = 1 - Math.pow(1 - d / 0.8, 3);
  const r = 60 + p * size;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r / 2,
        top: y - r / 2,
        width: r,
        height: r,
        borderRadius: "50%",
        border: `${Math.max(1, 14 * (1 - p))}px solid rgba(241,220,174,${0.7 * (1 - p)})`,
        boxShadow: `0 0 60px rgba(212,180,122,${0.45 * (1 - p)})`,
        pointerEvents: "none",
      }}
    />
  );
};

/** Full-frame flash on a hit. */
export const Flash: React.FC<{ t: number; at: number; strength?: number }> = ({ t, at, strength = 0.6 }) => {
  const d = t - at;
  if (d < -0.02 || d > 0.35) return null;
  const o = d < 0 ? 0 : strength * Math.exp(-d / 0.07);
  return <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #FFF6E0, #D4B47A 60%, #8a6a3a)", opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} />;
};
