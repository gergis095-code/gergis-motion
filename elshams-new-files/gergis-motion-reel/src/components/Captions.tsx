import React from "react";
import { C, CAPTION_TOP, CX, SAFE_W, SANS } from "../theme";
import { Line, Word, lerpT, prog } from "../timing";

/** Split a line into short phrases: after "," or "." (if the phrase has 2+ words), or before "and" once a phrase reaches 5 words. */
export const phrases = (words: Word[]) => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    const next = words[i + 1];
    cur.push(w);
    const punct = /[.,]$/.test(w.text) && cur.length >= 2;
    const long = cur.length >= 5 && next && next.text.toLowerCase() === "and";
    if (punct || long || !next) {
      out.push(cur);
      cur = [];
    }
  });
  return out;
};

/**
 * Word-synced captions. Every word of the line is laid out from the start
 * (so nothing jumps), revealed as it is spoken, and the word being spoken
 * is gold.
 */
export const Captions: React.FC<{ t: number; ln: Line; until: number }> = ({ t, ln, until }) => {
  const groups = phrases(ln.words);
  return (
    <>
      {groups.map((g, i) => (
        <Phrase key={i} t={t} words={g} lineEnd={ln.end} until={i < groups.length - 1 ? groups[i + 1][0].start - 0.06 : until} />
      ))}
    </>
  );
};

const Phrase: React.FC<{ t: number; words: Word[]; lineEnd: number; until: number }> = ({ t, words, lineEnd, until }) => {
  const a = words[0].start - 0.08;
  if (t < a - 0.2 || t > until + 0.05) return null;
  const blockIn = prog(t, a - 0.12, 0.18);
  const blockOut = 1 - prog(t, until - 0.1, 0.12);
  return (
    <div
      style={{
        position: "absolute",
        top: CAPTION_TOP,
        left: CX - SAFE_W / 2,
        width: SAFE_W,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 18,
        rowGap: 4,
        opacity: blockIn * blockOut,
        transform: `translateY(${(1 - blockOut) * -14}px)`,
      }}
    >
      {words.map((w, i) => {
        const next = words[i + 1]?.start ?? lineEnd;
        const shown = prog(t, w.start - 0.04, 0.16);
        const active = t >= w.start - 0.04 && t < next - 0.04;
        const pop = active ? lerpT(t, w.start - 0.04, w.start + 0.14, 1.22, 1) : 1;
        return (
          <span
            key={i}
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 70,
              lineHeight: 1.16,
              letterSpacing: "-0.01em",
              color: active ? C.gold : C.ivory,
              opacity: shown,
              transform: `translateY(${(1 - shown) * 22}px) scale(${pop})`,
              display: "inline-block",
              textShadow: "0 4px 24px rgba(0,0,0,.65)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
