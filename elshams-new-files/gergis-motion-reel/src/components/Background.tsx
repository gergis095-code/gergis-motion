import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, H, W } from "../theme";

/**
 * Warm black ground with slow gold "silk" lines, two drifting glows,
 * film grain and a vignette. `phase` drives the lines, so they can be
 * frozen (phase constant) and then set in motion.
 */
export const Background: React.FC<{ phase: number; energy: number }> = ({ phase, energy }) => {
  const frame = useCurrentFrame();
  const N = 22;
  const paths: string[] = [];
  for (let i = 0; i < N; i++) {
    const k = i / N;
    let d = "";
    for (let y = -40; y <= H + 40; y += 40) {
      const ny = y / H;
      const x =
        W * 0.55 +
        Math.sin(ny * 3.1 + phase * 1.6 + k * 2.4) * W * 0.2 +
        Math.sin(ny * 7.3 - phase * 2.2 + k * 5) * W * 0.05 * (1 + energy) +
        (k - 0.5) * W * 0.62;
      d += `${y === -40 ? "M" : "L"}${x.toFixed(1)} ${y}`;
    }
    paths.push(d);
  }
  const gx = 70 + Math.sin(phase * 0.5) * 12;
  const gy = 18 + Math.cos(phase * 0.4) * 8;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at ${gx}% ${gy}%, rgba(212,180,122,${0.16 + energy * 0.06}), transparent 60%),
                       radial-gradient(800px 800px at ${100 - gx}% ${100 - gy + 60}%, rgba(184,147,90,.10), transparent 60%)`,
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="silk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.goldLight} stopOpacity="0" />
            <stop offset="0.45" stopColor={C.goldLight} stopOpacity="1" />
            <stop offset="1" stopColor={C.goldDeep} stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="url(#silk)"
            strokeWidth={1.2}
            opacity={0.05 + 0.13 * Math.sin((i / N) * Math.PI)}
          />
        ))}
      </svg>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse 85% 70% at 50% 45%, transparent 35%, rgba(5,4,3,.82) 100%)" }}
      />
      {/* the hidden Img makes Remotion wait for the texture before rendering */}
      <Img src={staticFile("img/grain.png")} style={{ display: "none" }} />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("img/grain.png")})`,
          backgroundRepeat: "repeat",
          backgroundPosition: `${(frame * 97) % 384}px ${(frame * 61) % 384}px`,
          opacity: 0.07,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
