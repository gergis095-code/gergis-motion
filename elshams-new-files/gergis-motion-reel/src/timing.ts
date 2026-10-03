import { Easing, interpolate } from "remotion";
import vo from "../public/voiceover.json";
import music from "../public/music.json";

export type Word = { text: string; start: number; end: number };
export type Line = { id: number; text: string; start: number; end: number; words: Word[] };
export type Voiceover = {
  placeholder: boolean;
  voice: string;
  audio: string | null;
  duration: number;
  speechEnd: number;
  lines: Line[];
};

export const VO = vo as Voiceover;
export const LINES = VO.lines;
export const line = (id: number) => LINES[id - 1];
/** Start time (s) of word `i` in line `id`. */
export const ws = (id: number, i: number) => line(id).words[Math.min(i, line(id).words.length - 1)].start;
/** Start of the next line, or the end of the video for the last one. */
export const lineEnd = (id: number) => (id < LINES.length ? line(id + 1).start : VO.duration);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.77, 0, 0.18, 1);

/** 0 to 1 progress between two times, with the house easing. */
export const prog = (t: number, a: number, dur: number, e = ease) =>
  interpolate(t, [a, a + dur], [0, 1], { ...clamp, easing: e });

/** Map t through [a, b] to [from, to], clamped. */
export const lerpT = (t: number, a: number, b: number, from: number, to: number, e = ease) =>
  interpolate(t, [a, b], [from, to], { ...clamp, easing: e });

/** Fade in at `a`, fade out at `b` (both over `d` seconds). */
export const windowFade = (t: number, a: number, b: number, d = 0.3) =>
  Math.min(prog(t, a, d), 1 - prog(t, b - d, d));

export type Music = {
  bpm: number;
  drop: number;
  land: number;
  stop: number;
  resume: number;
  final: number;
  kicks: number[];
  snares: number[];
  impacts: number[];
  glitches: number[];
};
export const MUSIC = music as Music;

/** 1 right at a hit, decaying to 0 over `decay` seconds (0 before the hit). */
export const hitEnv = (t: number, times: number[], decay: number) => {
  let v = 0;
  for (const h of times) {
    const d = t - h;
    if (d >= 0 && d < decay * 4) v = Math.max(v, Math.exp(-d / decay));
  }
  return v;
};
