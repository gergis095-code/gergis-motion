import React from "react";
import { AbsoluteFill, Audio, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import { Background } from "./components/Background";
import { Captions } from "./components/Captions";
import { Burst, Flash, Shockwave } from "./components/Fx";
import { LogoBug } from "./components/Logo";
import { LightSweep, Shell } from "./components/Shell";
import { Cta } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { LogoReveal } from "./scenes/LogoReveal";
import { Services } from "./scenes/Services";
import { StopScroll } from "./scenes/StopScroll";
import { CX, FPS, H, SAFE, W } from "./theme";
import { MUSIC, VO, hitEnv, line, lineEnd, prog, ws } from "./timing";

const at = (s: number) => Math.max(0, Math.round(s * FPS));

const Sfx: React.FC<{ t: number; src: string; volume: number }> = ({ t, src, volume }) => (
  <Sequence from={at(t)} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

/** Red overlay of the zones TikTok and Instagram cover with their own UI. */
const SafeZones: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 150, background: "rgba(255,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: 350, background: "rgba(255,0,0,.35)" }} />
    <div style={{ position: "absolute", right: 0, top: 150, width: 150, height: H - 500, background: "rgba(255,0,0,.35)" }} />
    <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top, width: SAFE.right - SAFE.left, height: SAFE.bottom - SAFE.top, outline: "2px dashed rgba(0,255,120,.8)" }} />
  </AbsoluteFill>
);

export const GergisMotionIntro: React.FC<{ showSafeZones?: boolean }> = ({ showSafeZones }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // the background stays frozen until "move", flows with the beat,
  // and freezes again while the music tape-stops on "stop"
  const tm = ws(1, 4);
  const frozen = Math.max(0, Math.min(t, MUSIC.resume) - (MUSIC.stop + 0.1));
  const moving = Math.max(0, t - tm - frozen);
  const phase = moving < 0.6 ? (moving * moving) / 1.2 : moving - 0.3;
  const kick = hitEnv(t, MUSIC.kicks, 0.12);
  const energy = prog(t, tm, 0.5) * (1 - 0.6 * prog(t, tm + 1.2, 1.5)) + 0.6 * kick;

  // camera: big shake on impacts, small ones on the hook words and kicks
  const thumps = [0, 1, 2, 3].map((i) => ws(1, i));
  const shakeAmp = 26 * hitEnv(t, MUSIC.impacts, 0.11) + 7 * hitEnv(t, thumps, 0.07) + 2.5 * kick;
  const dx = shakeAmp * (random(`x${frame}`) * 2 - 1);
  const dy = shakeAmp * (random(`y${frame}`) * 2 - 1);
  const rot = shakeAmp * 0.04 * (random(`r${frame}`) * 2 - 1);
  const zoom = 1 + 0.014 * kick + 0.03 * hitEnv(t, MUSIC.impacts, 0.15);

  const L = [1, 2, 3, 4, 5].map(line);
  const cuts = [L[1].start - 0.12, L[2].start - 0.12, ws(3, 2) - 0.12, ws(3, 5) - 0.12, L[3].start - 0.12, L[4].start - 0.12];
  const bug = Math.min(prog(t, L[2].start - 0.1, 0.4), 1 - prog(t, L[4].start - 0.3, 0.3));

  return (
    <AbsoluteFill style={{ background: "#0B0A08" }}>
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${zoom})` }}>
      <Background phase={phase * 0.55} energy={energy} />

      <Shell t={t} a={0} b={lineEnd(1) - 0.05} noIn>
        <Hook t={t} />
      </Shell>
      <Shell t={t} a={L[1].start - 0.15} b={lineEnd(2) - 0.08}>
        <LogoReveal t={t} />
      </Shell>
      <Shell t={t} a={L[2].start - 0.15} b={lineEnd(3) - 0.08}>
        <Services t={t} />
      </Shell>
      <Shell t={t} a={L[3].start - 0.15} b={lineEnd(4) - 0.08}>
        <StopScroll t={t} />
      </Shell>
      <Shell t={t} a={L[4].start - 0.15} b={VO.duration + 1}>
        <Cta t={t} />
      </Shell>

      <Shockwave t={t} at={MUSIC.drop} x={CX} y={480} />
      <Shockwave t={t} at={MUSIC.land} x={CX} y={480} size={1000} />
      <Burst t={t} at={MUSIC.drop} x={CX} y={1040} seed="drop" power={1.2} count={60} />
      <Burst t={t} at={MUSIC.land} x={CX} y={480} seed="land" />
      <Burst t={t} at={MUSIC.resume} x={CX} y={600} seed="resume" count={36} power={0.8} />
      <Burst t={t} at={MUSIC.final} x={CX} y={410} seed="final" count={40} power={0.9} />
      </AbsoluteFill>

      {bug > 0 && (
        <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top + 4 }}>
          <div style={{ transform: `scale(${1 + 0.06 * kick})`, transformOrigin: "26px 26px" }}>
            <LogoBug opacity={bug} />
          </div>
        </div>
      )}

      {/* line 1 is set large in the hook itself, so captions start at line 2 */}
      {L.slice(1).map((ln, i) => (
        <Captions key={ln.id} t={t} ln={ln} until={i === 3 ? VO.speechEnd + 0.35 : lineEnd(ln.id) - 0.1} />
      ))}

      {cuts.map((c, i) => (
        <LightSweep key={i} t={t} at={c} />
      ))}
      <Flash t={t} at={MUSIC.drop} strength={0.7} />
      <Flash t={t} at={MUSIC.land} strength={0.4} />
      <Flash t={t} at={MUSIC.resume} strength={0.45} />
      <Flash t={t} at={MUSIC.final} strength={0.3} />

      {/* sound */}
      <Audio src={staticFile("music.wav")} volume={VO.audio ? 0.8 : 0.9} />
      {VO.audio && <Audio src={staticFile(VO.audio)} volume={1} />}
      {cuts.map((c, i) => (
        <Sfx key={i} t={c - 0.12} src="sfx/whoosh.wav" volume={0.42} />
      ))}
      {[6, 7, 8].map((i) => (
        <Sfx key={i} t={ws(4, i) - 0.05} src="sfx/pop.wav" volume={0.5} />
      ))}
      <Sfx t={ws(5, 0) + 0.12} src="sfx/click.wav" volume={0.7} />
      <Sfx t={ws(5, 4) + 0.08} src="sfx/click.wav" volume={0.7} />

      {showSafeZones && <SafeZones />}
    </AbsoluteFill>
  );
};
