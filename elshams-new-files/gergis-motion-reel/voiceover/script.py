"""The voiceover script and timing settings, shared by both voiceover tools."""

VOICE = "en-US-AndrewNeural"   # alternative: "en-US-GuyNeural"
RATE = "-4%"                   # slightly slower than default sounds more confident

LINES = [
    "Your business deserves to move.",
    "I'm Gergis, and this is Gergis Motion.",
    "Motion graphics. Website promo videos. Clean, modern websites.",
    "Made to stop the scroll and bring you customers.",
    "Follow for more, and DM me to start your project.",
]

LEAD_IN = 0.6                  # silence before the first line (seconds)
GAPS = [0.5, 0.55, 0.5, 0.45]  # silence after lines 1-4
END_HOLD = 3.0                 # end card time after the last word
MIN_TOTAL = 21.0               # the video is never shorter than this
MAX_TOTAL = 30.0
