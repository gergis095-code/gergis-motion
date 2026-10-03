import React, { useId } from "react";
import { C, SERIF } from "../theme";

/**
 * Gold gradient text drawn as SVG. CSS `background-clip: text` turns into a
 * solid gold box in headless Chrome whenever the text (or a parent) is
 * blurred, so all gradient type in the video goes through this instead.
 * `sheen` (0-100, optional) moves a bright highlight across the letters.
 */
export const GoldText: React.FC<{
  text: string;
  size: number;
  width: number;
  italic?: boolean;
  weight?: number;
  tracking?: number; // em
  sheen?: number;
  family?: string;
  style?: React.CSSProperties;
}> = ({ text, size, width, italic, weight = 500, tracking = 0, sheen, family = SERIF, style }) => {
  const id = useId().replace(/:/g, "");
  const h = Math.round(size * 1.3);
  const s = sheen ?? -100;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ display: "block", overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0" stopColor={C.goldLight} />
          <stop offset="0.5" stopColor={C.gold} />
          <stop offset="1" stopColor={C.goldDeep} />
        </linearGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset={Math.max(0, (s - 22) / 100)} stopColor="#FFF3D6" stopOpacity="0" />
          <stop offset={Math.min(1, Math.max(0, s / 100))} stopColor="#FFF3D6" stopOpacity="0.95" />
          <stop offset={Math.min(1, (s + 22) / 100)} stopColor="#FFF3D6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[`g${id}`, `s${id}`].map((fill, i) =>
        i === 1 && sheen === undefined ? null : (
          <text
            key={fill}
            x={width / 2 + (tracking * size) / 2}
            y={size * 0.98}
            textAnchor="middle"
            fill={`url(#${fill})`}
            style={{
              fontFamily: family,
              fontSize: size,
              fontWeight: weight,
              fontStyle: italic ? "italic" : "normal",
              letterSpacing: `${tracking}em`,
            }}
          >
            {text}
          </text>
        ),
      )}
    </svg>
  );
};
