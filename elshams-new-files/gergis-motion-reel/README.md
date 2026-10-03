# Gergis Motion intro reel

A 1080×1920, 30 fps vertical intro video for TikTok and Instagram Reels, built with Remotion (React + TypeScript) in the Gergis Motion black and gold brand.

## Make the final video

You need Node.js 18+ and Python 3.

```bash
npm install
pip install edge-tts numpy
npm run voiceover     # makes the voiceover, word timings, and the music locked to them
npm run render        # makes out/gergis-motion-intro.mp4 (H.264 + AAC)
```

`npm run voiceover` uses edge-tts with `en-US-AndrewNeural`. Each line is generated separately so the pauses are exact, and the word timings drive the captions and animations. To change the voice, speed, script or pauses, edit `voiceover/script.py` and run it again. The video length follows the voiceover automatically (kept between 21 and 30 seconds).

No voiceover yet? `npm run estimate` writes estimated timings (and matching music) so you can preview and render without the voice.

## Music and sound

`voiceover/make_music.py` synthesizes the whole track from scratch (no music rights needed) and times it to the voice: a riser and word thumps build to a beat drop on "move.", the music tape-stops on "stop" and slams back in on "and bring you customers", and a final impact lands on the last word. It also writes `public/music.json`, which the video uses for camera shake, flashes, spark bursts and kick pulses. Run it on its own with `npm run music`.

## Preview and edit

```bash
npm run studio        # opens Remotion Studio in the browser
```

The `SafeZoneCheck` composition shows the same video with the TikTok/Reels UI zones in red (top 150px, bottom 350px, right 150px). All text stays inside the green dashed area.

## Structure

- `src/Video.tsx`: timeline, scenes, captions and sound
- `src/scenes/`: Hook ("deserves to move"), LogoReveal, Services, StopScroll, Cta
- `src/components/`: background, captions, logo, gold text, transitions
- `src/theme.ts`: brand colors, fonts and safe-zone layout
- `public/`: fonts, El Shams screenshots, sound effects, voiceover
- `voiceover/`: script, edge-tts generator, timing estimator

Gold gradient text is drawn as SVG (`GoldText`), because CSS `background-clip: text` renders as a solid box in headless Chrome when blurred.
