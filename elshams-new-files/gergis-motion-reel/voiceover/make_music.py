"""Synthesize the music track, timed to the voiceover.

    pip install numpy
    python voiceover/make_music.py

Reads public/voiceover.json and writes public/music.wav plus public/music.json
(beat and impact times the video uses for camera shake, flashes and pulses).
Everything is generated from scratch, so there are no music rights to clear.

Story of the track:
  intro    a riser and ticking hats build tension, a thump lands on each word
  "move."  the beat drops with a big impact
  "stop"   tape-stop: the music winds down and goes silent
  "and"    the beat slams back in for "bring you customers"
  end      final impact, then a warm pad under the end card
"""
import json
import wave
from pathlib import Path

import numpy as np

SR = 44100
BPM = 104
BEAT = 60 / BPM
STEP = BEAT / 4
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(11)


# ---------- building blocks ----------
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def fft_filter(x, lo=None, hi=None):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    mask = np.ones_like(f)
    if lo:
        mask *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        mask *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(spec * mask, len(x))


def noise(dur):
    return rng.standard_normal(int(dur * SR))


def kick(level=1.0):
    t = t_axis(0.55)
    f = 46 + 110 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    click = fft_filter(noise(0.55), lo=2500) * np.exp(-t * 260) * 0.35
    return np.tanh((body + click) * 1.6) * level


def sub808(freq, dur, level=1.0):
    t = t_axis(dur)
    f = freq * (1 + 0.6 * np.exp(-t * 40))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    x *= np.minimum(1, (dur - t) / 0.03)
    return np.tanh(x * 2.2) * 0.75 * level


def clap(level=1.0):
    t = t_axis(0.35)
    env = np.zeros_like(t)
    for d in (0.0, 0.011, 0.022):
        env += np.where(t >= d, np.exp(-(t - d) * 120), 0)
    env += np.exp(-t * 16) * 0.35
    return fft_filter(noise(0.35), lo=900, hi=7000) * env * 0.55 * level


def hat(open_=False, level=1.0):
    dur = 0.32 if open_ else 0.07
    t = t_axis(dur)
    return fft_filter(noise(dur), lo=7000) * np.exp(-t * (11 if open_ else 70)) * 0.32 * level


def blip(level=1.0):
    t = t_axis(0.05)
    sq = np.sign(np.sin(2 * np.pi * rng.uniform(900, 2400) * t))
    return sq * np.exp(-t * 60) * 0.12 * level


def impact(level=1.0, length=2.4):
    t = t_axis(length)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-t * 9)) / SR) * np.exp(-t * 1.6)
    crash = fft_filter(noise(length), lo=300, hi=9000) * np.exp(-t * 2.4) * 0.45
    ir_t = t_axis(1.2)
    ir = noise(1.2) * np.exp(-ir_t * 4.5) * 0.02
    tail = np.convolve(crash, ir)[: len(t)]
    return np.tanh((boom * 1.1 + crash + tail) * 1.3) * level


def riser(dur, level=1.0):
    """Noise that sweeps upward plus a rising tone; ends at full volume."""
    n = int(dur * SR)
    out = np.zeros(n)
    hop = 2048
    for i in range(0, n, hop):
        k = i / n
        seg = noise(hop / SR)
        out[i : i + hop] = fft_filter(seg, lo=300 + 5000 * k ** 2, hi=1200 + 9000 * k)[: n - i]
    t = t_axis(dur)
    tone = np.sin(2 * np.pi * np.cumsum(180 * 2 ** (3 * t / dur)) / SR) * 0.25
    env = (t / dur) ** 2.2
    return (out * 0.5 + tone) * env * level


def swell(dur, level=1.0):
    """Reverse-cymbal style swell into a cut."""
    t = t_axis(dur)
    return fft_filter(noise(dur), lo=2000, hi=12000) * (t / dur) ** 3 * 0.45 * level


def pad(chord_freqs, dur, level=1.0):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for f in chord_freqs:
        for det in (-0.12, 0.0, 0.11):
            ff = f * 2 ** (det / 12)
            x += 2 * ((t * ff) % 1) - 1
    x = fft_filter(x / (len(chord_freqs) * 3), hi=1400)
    env = np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.3)
    return x * env * 0.18 * level


# ---------- arrangement ----------
def main():
    vo = json.loads((ROOT / "public" / "voiceover.json").read_text())
    L = vo["lines"]
    ws = lambda li, wi: L[li - 1]["words"][min(wi, len(L[li - 1]["words"]) - 1)]["start"]
    D = vo["duration"]
    drop = ws(1, 4)
    land = ws(2, 5)
    stop = ws(4, 2)
    resume = ws(4, 5)
    final = vo["speechEnd"]
    cuts = [L[1]["start"], L[2]["start"], ws(3, 2), ws(3, 5), L[3]["start"], L[4]["start"]]

    n = int((D + 0.5) * SR)
    music = np.zeros(n)
    info = {"bpm": BPM, "drop": drop, "land": land, "stop": stop, "resume": resume, "final": final,
            "kicks": [], "snares": [], "impacts": [], "glitches": []}

    def put(sig, at, gain=1.0):
        i = int(at * SR)
        if i >= n or i + len(sig) <= 0:
            return
        j = max(0, -i)
        sig = sig[j:]
        i = max(0, i)
        e = min(n, i + len(sig))
        music[i:e] += sig[: e - i] * gain

    # intro: riser, accelerating ticks, a thump on each word, digital glitches
    put(riser(drop - 0.15, 0.95), 0.15)
    music[int((drop - 0.07) * SR) : int(drop * SR)] *= 0.0  # a breath of silence before the drop
    tick = drop - STEP * 2
    k = 0
    while tick > 0.05:
        put(hat(level=0.25 + 0.75 * (tick / drop) ** 2), tick)
        tick -= STEP * 2 if tick > drop * 0.5 else STEP
        k += 1
    for wi in range(4):
        put(kick(0.55), ws(1, wi))
        put(sub808(55, 0.3, 0.35), ws(1, wi))
    for g in (0.35, 0.9, 1.25, 1.75, 2.05):
        if g < drop - 0.15:
            put(blip(1.0), g)
            info["glitches"].append(round(g, 3))

    # the beat: one-bar pattern over a four-bar progression (Am, F, C, G)
    chords = [(220.0, 261.63, 329.63), (174.61, 220.0, 261.63), (196.0, 261.63, 329.63), (196.0, 246.94, 293.66)]
    roots = [55.0, 43.65, 65.41, 49.0]
    kick_steps, clap_steps = (0, 7, 10), (4, 12)

    def beat_section(start, end, with_pad=True):
        bar = 0
        b0 = start
        while b0 < end - 0.05:
            ci = bar % 4
            if with_pad:
                put(pad(chords[ci], min(BEAT * 4, end - b0) + 0.05, 0.9), b0)
            for s in range(16):
                ts = b0 + s * STEP
                if ts >= end - 0.02:
                    break
                swing = STEP * 0.12 if s % 2 else 0
                if s in kick_steps:
                    put(kick(0.95), ts)
                    put(sub808(roots[ci], STEP * (3 if s == 0 else 2.6)), ts)
                    info["kicks"].append(round(ts, 3))
                if s in clap_steps:
                    put(clap(), ts)
                    info["snares"].append(round(ts, 3))
                if s % 2 == 0 or s in (7, 15):
                    put(hat(level=0.9 if s % 4 == 2 else 0.55), ts + swing)
                if s == 14:
                    put(hat(open_=True, level=0.6), ts)
            b0 += BEAT * 4
            bar += 1

    beat_section(drop, stop)
    beat_section(resume, final)

    # impacts and transition swells
    for at, lvl in ((drop, 1.0), (land, 0.7), (resume, 0.85), (final, 0.9)):
        put(impact(lvl), at)
        info["impacts"].append(round(at, 3))
    for c in cuts:
        if c not in (stop, resume):
            put(swell(0.55, 0.8), c - 0.55)

    # tape stop on "stop": the music winds down over 0.4 s, then silence until "and"
    ts_i, te_i = int(stop * SR), int((stop + 0.4) * SR)
    seg_len = te_i - ts_i
    speed = np.linspace(1, 0, seg_len) ** 1.3
    pos = ts_i + np.cumsum(speed)
    music[ts_i:te_i] = np.interp(pos, np.arange(n), music) * np.linspace(1, 0.2, seg_len)
    music[te_i : int(resume * SR) - int(0.02 * SR)] = 0
    put(fft_filter(noise(0.25), lo=200, hi=2500) * np.exp(-t_axis(0.25) * 14) * 0.25, stop + 0.38)  # scratch tail
    put(swell(0.45, 0.9), resume - 0.45)

    # end card: warm pad and a slow shimmer
    tail = D - final
    put(pad((220.0, 261.63, 329.63, 440.0), tail + 0.3, 1.3), final)
    shimmer = fft_filter(noise(tail), lo=6000) * np.exp(-t_axis(tail) * 1.4) * 0.08
    put(shimmer, final)

    # duck under the voice when a real voiceover exists
    if vo.get("audio"):
        env = np.ones(n)
        for ln in L:
            a, b = int((ln["start"] - 0.08) * SR), int((ln["end"] + 0.05) * SR)
            env[a:b] = 0.5
        kern = np.ones(int(0.08 * SR)) / int(0.08 * SR)
        env = np.convolve(env, kern, mode="same")
        music *= env

    # fade out, normalize, slight stereo width
    fade = int(1.2 * SR)
    end_i = int(D * SR)
    music[end_i - fade : end_i] *= np.linspace(1, 0, fade)
    music[end_i:] = 0
    music = music[:end_i]
    music = np.tanh(music / (np.max(np.abs(music)) + 1e-9) * 1.25) * 0.89
    delay = int(0.012 * SR)
    left = music
    right = np.concatenate([np.zeros(delay), music[:-delay]]) * 0.25 + music * 0.75
    stereo = np.stack([left, right], axis=1)
    pcm = (stereo * 32767).astype("<i2")
    with wave.open(str(ROOT / "public" / "music.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    (ROOT / "public" / "music.json").write_text(json.dumps(info, indent=2))
    print(f"Saved public/music.wav ({D:.1f}s, {BPM} BPM, drop at {drop:.2f}s)")


if __name__ == "__main__":
    main()
