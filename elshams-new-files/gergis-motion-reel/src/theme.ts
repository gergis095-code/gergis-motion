import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Gergis Motion brand: black and gold (see gergis-motion/BRAND.md)
export const C = {
  bg: "#0B0A08",
  bg2: "#12100C",
  surface: "#1A1712",
  gold: "#D4B47A",
  goldLight: "#F1DCAE",
  goldDeep: "#B8935A",
  ivory: "#F4EFE6",
  muted: "#A39C8F",
  dim: "#8C8476",
  line: "rgba(212,180,122,.22)",
  lineSoft: "rgba(244,239,230,.08)",
  ok: "#9CC59A",
};

export const GOLD_GRADIENT = `linear-gradient(135deg, ${C.goldLight}, ${C.gold} 50%, ${C.goldDeep})`;

export const SERIF = '"Cormorant Garamond", "Times New Roman", serif';
export const SANS = 'Manrope, "Segoe UI", sans-serif';

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// TikTok / Instagram Reels safe zone: nothing important in the top 150px,
// bottom 350px or right 150px. A small extra margin is kept on every side.
export const SAFE = { top: 170, bottom: H - 370, left: 72, right: W - 170 };
export const SAFE_W = SAFE.right - SAFE.left;
export const CX = SAFE.left + SAFE_W / 2; // horizontal center of the safe area

// Layout bands inside the safe zone
export const VISUAL = { top: 240, bottom: 1150 };
export const CAPTION_TOP = 1215;

const fonts: Array<[string, string, string, string]> = [
  ["Manrope", "fonts/manrope-latin-500-normal.woff2", "500", "normal"],
  ["Manrope", "fonts/manrope-latin-700-normal.woff2", "700", "normal"],
  ["Manrope", "fonts/manrope-latin-800-normal.woff2", "800", "normal"],
  ["Cormorant Garamond", "fonts/cormorant-garamond-latin-400-normal.woff2", "400", "normal"],
  ["Cormorant Garamond", "fonts/cormorant-garamond-latin-500-normal.woff2", "500", "normal"],
  ["Cormorant Garamond", "fonts/cormorant-garamond-latin-400-italic.woff2", "400", "italic"],
  ["Cormorant Garamond", "fonts/cormorant-garamond-latin-500-italic.woff2", "500", "italic"],
];
for (const [family, url, weight, style] of fonts) {
  loadFont({ family, url: staticFile(url), weight, style });
}
