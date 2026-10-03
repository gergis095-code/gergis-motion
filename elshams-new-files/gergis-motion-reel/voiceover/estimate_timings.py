"""Write estimated word timings (no audio) so the video can be previewed
before the real voiceover exists. make_voiceover.py replaces this output.

    python voiceover/estimate_timings.py
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from music_hook import build_music  # noqa: E402
from script import END_HOLD, GAPS, LEAD_IN, LINES, MAX_TOTAL, MIN_TOTAL, VOICE  # noqa: E402

PUBLIC = Path(__file__).resolve().parent.parent / "public"


def word_time(word):
    # Roughly matches en-US-AndrewNeural at -4%: ~2.6 words per second.
    letters = len(re.sub(r"[^\w]", "", word))
    return 0.16 + 0.052 * letters


lines, t = [], LEAD_IN
for i, text in enumerate(LINES):
    start, words = t, []
    for token in text.split():
        d = word_time(token)
        words.append({"text": token, "start": round(t, 3), "end": round(t + d, 3)})
        t += d
        if token[-1] in ",":
            t += 0.18
        elif token[-1] in ".":
            t += 0.3
    lines.append({"id": i + 1, "text": text, "start": round(start, 3), "end": round(t, 3), "words": words})
    t += GAPS[i] if i < len(GAPS) else 0

speech_end = lines[-1]["words"][-1]["end"]
total = min(MAX_TOTAL, max(MIN_TOTAL, speech_end + END_HOLD))
data = {"placeholder": True, "voice": VOICE, "audio": None,
        "duration": round(total, 3), "speechEnd": round(speech_end, 3), "lines": lines}
(PUBLIC / "voiceover.json").write_text(json.dumps(data, indent=2))
print(f"Estimated timings written ({total:.1f}s)")

build_music()
