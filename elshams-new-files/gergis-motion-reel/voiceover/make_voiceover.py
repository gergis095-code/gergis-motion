"""Generate the voiceover with edge-tts and export word timings.

    pip install edge-tts
    python voiceover/make_voiceover.py

Writes public/voiceover.mp3 and public/voiceover.json. Each line is
synthesized on its own so the pauses between lines are exact; word timings
come from edge-tts WordBoundary events. Needs ffmpeg on PATH, or uses the
copy bundled with Remotion (npx remotion ffmpeg).
"""
import asyncio
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

import edge_tts

sys.path.insert(0, str(Path(__file__).parent))
from music_hook import build_music  # noqa: E402
from script import END_HOLD, GAPS, LEAD_IN, LINES, MAX_TOTAL, MIN_TOTAL, RATE, VOICE  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
LINE_DIR = ROOT / "voiceover" / "lines"
PUBLIC = ROOT / "public"


def tool(name):
    """ffmpeg/ffprobe from PATH, else Remotion's bundled copy."""
    if shutil.which(name):
        return [name]
    return ["npx", "--yes", "remotion", name]


def duration_of(path):
    out = subprocess.run(
        tool("ffprobe") + ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True, cwd=ROOT,
    ).stdout.strip()
    return float(out.splitlines()[-1])


def align(text, boundaries):
    """Attach the script's own words (with punctuation) to edge-tts timings."""
    tokens = text.split()
    clean = lambda s: re.sub(r"[^\w']", "", s).lower()
    words, i = [], 0
    for b in boundaries:
        if i < len(tokens) and clean(tokens[i]) == clean(b["text"]):
            label = tokens[i]
            i += 1
        else:
            label = b["text"]
        words.append({"text": label, "start": b["start"], "end": b["end"]})
    return words


async def synth(index, text):
    comm = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    path = LINE_DIR / f"{index + 1:02d}.mp3"
    boundaries = []
    with open(path, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / 1e7
                boundaries.append({"text": chunk["text"], "start": start, "end": start + chunk["duration"] / 1e7})
    return path, boundaries


async def main():
    LINE_DIR.mkdir(parents=True, exist_ok=True)
    lines, inputs, filters = [], [], []
    t = LEAD_IN
    for i, text in enumerate(LINES):
        path, boundaries = await synth(i, text)
        dur = duration_of(path)
        words = [{**w, "start": round(w["start"] + t, 3), "end": round(w["end"] + t, 3)} for w in align(text, boundaries)]
        lines.append({"id": i + 1, "text": text, "start": round(t, 3), "end": round(t + dur, 3), "words": words})
        inputs += ["-i", str(path)]
        ms = int(round(t * 1000))
        filters.append(f"[{i}:a]adelay={ms}|{ms}[a{i}]")
        print(f"line {i + 1}: {t:5.2f}s to {t + dur:5.2f}s  {text}")
        t += dur + (GAPS[i] if i < len(GAPS) else 0)

    speech_end = lines[-1]["words"][-1]["end"] if lines[-1]["words"] else lines[-1]["end"]
    total = min(MAX_TOTAL, max(MIN_TOTAL, speech_end + END_HOLD))
    mix = "".join(f"[a{i}]" for i in range(len(LINES)))
    filters.append(f"{mix}amix=inputs={len(LINES)}:normalize=0,apad,atrim=0:{total:.3f}[out]")
    subprocess.run(
        tool("ffmpeg") + ["-y", "-v", "error", *inputs, "-filter_complex", ";".join(filters),
                          "-map", "[out]", "-ar", "48000", "-ac", "2", "-b:a", "192k", str(PUBLIC / "voiceover.mp3")],
        check=True, cwd=ROOT,
    )
    data = {"placeholder": False, "voice": VOICE, "audio": "voiceover.mp3",
            "duration": round(total, 3), "speechEnd": round(speech_end, 3), "lines": lines}
    (PUBLIC / "voiceover.json").write_text(json.dumps(data, indent=2))
    print(f"\nSaved public/voiceover.mp3 and public/voiceover.json ({total:.1f}s)")
    build_music()


if __name__ == "__main__":
    asyncio.run(main())
