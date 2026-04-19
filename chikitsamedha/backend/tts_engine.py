from __future__ import annotations

import io
import os
import tempfile
from typing import Optional


def tts_available() -> bool:
    try:
        import pyttsx3  # noqa: F401
        return True
    except Exception:
        return False


def synth_to_wav_bytes(text: str) -> Optional[bytes]:
    try:
        import pyttsx3
    except Exception:
        return None
    try:
        engine = pyttsx3.init()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
            out_path = f.name
        engine.save_to_file(text, out_path)
        engine.runAndWait()
        with open(out_path, "rb") as rf:
            data = rf.read()
        try:
            os.remove(out_path)
        except Exception:
            pass
        return data
    except Exception:
        return None

