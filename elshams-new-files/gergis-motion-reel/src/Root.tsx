import React from "react";
import { Composition } from "remotion";
import "./theme";
import { FPS, H, W } from "./theme";
import { VO } from "./timing";
import { GergisMotionIntro } from "./Video";

const frames = Math.round(VO.duration * FPS);

export const Root: React.FC = () => (
  <>
    <Composition id="GergisMotionIntro" component={GergisMotionIntro} durationInFrames={frames} fps={FPS} width={W} height={H} defaultProps={{ showSafeZones: false }} />
    {/* same video with the TikTok / Reels UI zones drawn in red, for checking layouts */}
    <Composition id="SafeZoneCheck" component={GergisMotionIntro} durationInFrames={frames} fps={FPS} width={W} height={H} defaultProps={{ showSafeZones: true }} />
  </>
);
