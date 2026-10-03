import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setAudioCodec("aac");
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
// Use a local headless Chrome if REMOTION_BROWSER is set (e.g. in sandboxes without internet).
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
