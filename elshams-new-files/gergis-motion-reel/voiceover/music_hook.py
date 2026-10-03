"""Rebuild the music after the timings change, so the beat stays locked to the voice."""


def build_music():
    try:
        from make_music import main
    except ImportError as e:  # numpy missing
        print(f"Music not rebuilt ({e}). Run: pip install numpy && python voiceover/make_music.py")
        return
    main()
