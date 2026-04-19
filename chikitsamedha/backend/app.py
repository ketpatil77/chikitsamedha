"""FastAPI backend for Chikitsāmedhā (offline rule-based).

Endpoints:
- GET /api/list         -> available medicines + synonyms
- POST /api/profile     -> validate/echo profile with BMI
- POST /api/check       -> compute interaction risk for 1..5 drugs
- POST /api/pdf         -> generate a PDF report
- POST /api/tts         -> optional TTS to WAV bytes
- POST /api/scan        -> optional OCR image text extraction
"""
from __future__ import annotations

import base64
import io
import os
import tempfile
from pathlib import Path
from typing import Dict, List, Optional
import datetime as _dt
import os

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import shutil
from pydantic import BaseModel, Field, conlist

# Optional OCR engine (pytesseract) availability + default Windows path
DEFAULT_TESS_CMD = os.path.expandvars(r"%ProgramFiles%\Tesseract-OCR\tesseract.exe")
try:
    import pytesseract  # type: ignore
    os.environ.setdefault("TESSERACT_CMD", DEFAULT_TESS_CMD)
except Exception:
    pytesseract = None  # type: ignore

print("[OCR] available:", bool(pytesseract))

from .data_loader import DataBundle, load_data, fuzzy_canonicalize, build_choices, synonyms_list
from .interaction_engine import (
    aggregate_interactions,
    compute_bmi,
    evaluate_risk,
)
from .tts_engine import synth_to_wav_bytes, tts_available
from .pdf_engine import build_pdf_bytes


BASE_DIR = Path(__file__).resolve().parents[1]
DATA = load_data(BASE_DIR / "data")

AGE_BANDS = {
    "infant": (0.0, 1.9, 1.0),
    "child": (2.0, 12.0, 8.0),
    "teen": (13.0, 18.0, 16.0),
    "adult": (19.0, 60.0, 35.0),
    "senior": (61.0, 120.0, 70.0),
}

# Port configured via environment
DEFAULT_PORT = 8000
try:
    PORT = int(os.getenv("CHIKI_PORT", str(DEFAULT_PORT)))
except Exception:
    PORT = DEFAULT_PORT

app = FastAPI(title="Chikitsāmedhā API", version="1.0")

# Strict local CORS
allowed_origins = {
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    f"http://127.0.0.1:{PORT}",
    f"http://localhost:{PORT}",
}
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(allowed_origins),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Serve the built frontend at /app (open http://127.0.0.1:8000/app)
frontend_dist = BASE_DIR / "frontend" / "dist"
frontend_src = BASE_DIR / "frontend"
if frontend_dist.exists():
    app.mount("/app", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
elif frontend_src.exists():
    # Fallback to raw sources (useful during dev, but expect Vite dev server at 5173)
    app.mount("/app", StaticFiles(directory=str(frontend_src), html=True), name="frontend")


@app.on_event("startup")
async def _banner():
    # Mini self-test + banner
    try:
        meds_n = len(DATA.medicines)
        inter_n = len(DATA.interactions)
        syn_n = len(DATA.synonyms)
        c, conf, _ = fuzzy_canonicalize("ipobrufen", DATA)
        ok = (c == "Ibuprofen" and conf >= 60)
        print(f"[STATUS] Chikitsamedha backend online - serving new UI at /app (port: {PORT})")
        print(f"[INFO] Data counts: medicines={meds_n}, interactions={inter_n}, synonyms={syn_n}; fuzzy_ok={ok}")
        print("[INFO] Age bands active -> " + ", ".join(label.title() for label in AGE_BANDS.keys()))
        try:
            ped = aggregate_interactions(["Aspirin"], {"age": 4}, DATA)
            ped_ok = ped.get("contraindicated") and ped.get("risk_level") == "Contraindicated" and ped.get("risk_score", 0) >= 95
            status = "OK" if ped_ok else "ATTENTION"
            print(f"[TEST] pediatric sanity: Aspirin @ age 4 -> Contraindicated {status}")
        except Exception as ped_err:
            print(f"[TEST] pediatric sanity check failed: {ped_err}")
    except Exception as e:
        print(f"[WARN] Startup self-test failed: {e}")


@app.get("/api/list")
def list_items():
    choices = build_choices(DATA)
    syns = synonyms_list(DATA)
    return {"drugs": sorted(DATA.medicines["drug"].tolist()), "choices": choices, "synonyms": syns}


@app.get("/api/medicines")
def list_medicines_alias():
    """Alias for /api/list for compatibility with some clients."""
    return list_items()


@app.get("/api/suggest")
def suggest(type: str = "medicine", q: str = "", limit: int = 6):
    """Lightweight autosuggest for medicines or diseases.
    - type=medicine|disease
    - q: query string
    - limit: max suggestions
    Returns: { suggestions: [ { label, value, score } ] }
    """
    suggestions: List[Dict] = []
    if not q:
        return {"suggestions": suggestions}
    q = str(q).strip()
    t = type.lower()
    if t.startswith("med"):
        # medicines + synonyms keys
        from .data_loader import _synonym_map  # type: ignore
        syn = _synonym_map(DATA)
        choices = DATA.medicines["drug"].tolist() + list(syn.keys())
        from rapidfuzz import process, fuzz
        res = process.extract(q, choices, scorer=fuzz.WRatio, limit=limit)
        for label, score, _ in res:
            label = str(label)
            if label.lower() in syn:
                value = syn[label.lower()]
            else:
                value = label
            suggestions.append({"label": value, "value": value, "canonical": value, "score": int(score), "type": "medicine"})
    elif t.startswith("dis"):
        # diseases by unique names
        names = sorted(set([str(x) for x in DATA.diseases["disease"].tolist()]))
        from rapidfuzz import process, fuzz
        res = process.extract(q, names, scorer=fuzz.WRatio, limit=limit)
        for label, score, _ in res:
            suggestions.append({"label": str(label), "value": str(label), "canonical": str(label), "score": int(score), "type": "disease"})
    else:
        # both: merge
        meds = suggest("medicine", q, limit)["suggestions"]
        dis = suggest("disease", q, limit)["suggestions"]
        suggestions = meds[: limit//2] + dis[: limit - len(meds[: limit//2])]
    # Deduplicate by value keeping best score
    seen = {}
    for s in suggestions:
        if s["value"] not in seen or s["score"] > seen[s["value"]]["score"]:
            seen[s["value"]] = s
    return {"suggestions": list(seen.values())[:limit]}


@app.post("/api/profile")
def save_profile(profile: Dict):
    required = ["name", "age", "weight", "height", "blood_group"]
    missing = [k for k in required if not str(profile.get(k, "")).strip()]
    if missing:
        raise HTTPException(status_code=400, detail={"missing": missing})
    bmi = compute_bmi(profile.get("weight"), profile.get("height"))
    return {"ok": True, "bmi": bmi, "conditions": profile.get("diseases", [])}


class ProfileModel(BaseModel):
    name: Optional[str] = None
    age: Optional[float] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    blood_group: Optional[str] = None
    diseases: List[str] = Field(default_factory=list, alias="diseases")
    viral_illness: Optional[bool] = False
    age_band: Optional[str] = None


class CheckRequest(BaseModel):
    profile: Optional[ProfileModel] = Field(default_factory=ProfileModel)
    # Pydantic v2 uses min_length/max_length
    medicines: conlist(str, min_length=1, max_length=5)
    contexts: List[str] = Field(default_factory=list)
    age_band: Optional[str] = None
    simple: Optional[bool] = None
    mode: Optional[str] = None


class CompareRequest(BaseModel):
    profiles: List[ProfileModel] = Field(default_factory=list)
    sets: List[List[str]] = Field(default_factory=list)
    contexts: List[str] = Field(default_factory=list)
    age_band: Optional[str] = None
    simple: Optional[bool] = None
    mode: Optional[str] = None


def apply_age_band(profile: Dict, age_band: Optional[str]) -> Dict:
    if not age_band:
        return profile
    info = AGE_BANDS.get(str(age_band).lower())
    if not info:
        return profile
    low, high, default = info
    raw_age = profile.get("age")
    try:
        age_val = float(raw_age)
    except Exception:
        age_val = 0.0
    if age_val <= 0:
        profile["age"] = default
    profile["age_band"] = str(age_band).title()
    return profile


@app.post("/api/check")
def check(payload: CheckRequest, simple: Optional[int] = Query(default=0), mode: Optional[str] = None):
    profile = (payload.profile or ProfileModel()).model_dump()
    profile = apply_age_band(profile, payload.age_band or profile.get("age_band"))
    meds: List[str] = payload.medicines or []
    contexts = payload.contexts or []

    simple_mode = bool(payload.simple) or bool(simple) or str(payload.mode or mode or "").lower() == "simple"
    if simple_mode:
        print("[INFO] Simple-Language Mode Active")

    # Fuzzy normalization
    normalized: List[Dict] = []
    for raw in meds:
        canon, conf, sugg = fuzzy_canonicalize(raw, DATA)
        if not canon:
            normalized.append({"input": raw, "recognized": False, "suggestions": sugg})
        else:
            normalized.append({"input": raw, "recognized": True, "name": canon, "confidence": conf, "suggestions": sugg})

    recognized = [n["name"] for n in normalized if n.get("recognized")]
    if not recognized:
        return {"normalized": normalized, "result": None}

    result = aggregate_interactions(recognized, profile, DATA, contexts=contexts, simple_mode=simple_mode)
    evalr = evaluate_risk(recognized, profile, DATA, contexts=contexts, simple_mode=simple_mode)
    try:
        result.update(evalr)
    except Exception:
        pass
    result["contexts"] = contexts
    result["age_band"] = profile.get("age_band")
    result["simple_mode"] = simple_mode
    inputs = {"profile": profile, "medicines": recognized, "diseases": profile.get("diseases", []), "contexts": contexts}
    return {"normalized": normalized, "inputs": inputs, "result": result}


@app.post("/api/compare")
def compare(payload: CompareRequest, simple: Optional[int] = Query(default=0), mode: Optional[str] = None):
    if not payload.sets:
        raise HTTPException(status_code=400, detail="sets required")
    profiles = payload.profiles or [ProfileModel()]
    contexts = payload.contexts or []
    simple_mode = bool(payload.simple) or bool(simple) or str(payload.mode or mode or "").lower() == "simple"
    results = []
    for idx, med_set in enumerate(payload.sets):
        med_list = [m for m in med_set if str(m).strip()]
        if not med_list:
            continue
        base_profile = profiles[idx] if idx < len(profiles) else profiles[-1]
        prof_data = base_profile.model_dump()
        prof_data = apply_age_band(prof_data, payload.age_band or prof_data.get("age_band"))
        agg = aggregate_interactions(med_list, prof_data, DATA, contexts=contexts, simple_mode=simple_mode)
        safe = max(0.0, 100.0 - agg["risk_score"])
        results.append({
            "id": idx,
            "medicines": med_list,
            "risk_score": agg["risk_score"],
            "risk_level": agg["risk_level"],
            "safe_percent": round(safe, 1),
            "summary_en": agg["explanations"]["en"],
            "summary_mr": agg["explanations"]["mr"],
            "contraindicated": agg["contraindicated"],
        })
    if not results:
        raise HTTPException(status_code=400, detail="no valid sets to compare")
    results.sort(key=lambda x: (x["risk_score"], -x["safe_percent"]))
    for rank, item in enumerate(results, start=1):
        item["rank"] = rank
    return {"results": results, "contexts": contexts, "simple_mode": simple_mode}


@app.post("/api/pdf")
def pdf(payload: Dict):
    info = payload.get("info") or {}
    data = build_pdf_bytes(info)
    return StreamingResponse(io.BytesIO(data), media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=report.pdf"})


@app.post("/api/tts")
def tts(payload: Dict):
    text = str(payload.get("text") or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="text required")
    if not tts_available():
        return JSONResponse({"ok": False, "message": "TTS not available"}, status_code=501)
    audio = synth_to_wav_bytes(text)
    if not audio:
        return JSONResponse({"ok": False, "message": "TTS failed"}, status_code=500)
    b64 = base64.b64encode(audio).decode("ascii")
    return {"ok": True, "audio_b64": b64, "mime": "audio/wav"}


@app.post("/api/scan")
async def scan(file: UploadFile = File(...)):
    try:
        from PIL import Image
    except Exception:
        return JSONResponse({"error": "OCR not available"}, status_code=501)

    # Simple availability guard per spec
    cmd_env = os.path.expandvars(os.getenv("TESSERACT_CMD", ""))
    if not pytesseract or not os.path.exists(cmd_env):
        fallback = shutil.which("tesseract")
        if fallback:
            cmd_env = fallback
        else:
            return JSONResponse({"error": "Tesseract not available"}, status_code=501)

    # Ensure tesseract binary works
    try:
        cmd = cmd_env or shutil.which("tesseract")
        if cmd and hasattr(pytesseract, 'pytesseract'):
            pytesseract.pytesseract.tesseract_cmd = cmd
        _ = pytesseract.get_tesseract_version()  # type: ignore
    except Exception:
        return JSONResponse({"error": "OCR engine (Tesseract) not installed"}, status_code=501)

    try:
        content = await file.read()
        img = Image.open(io.BytesIO(content)).convert("L")
        # Basic preprocessing: autocontrast + resize + threshold
        try:
            from PIL import ImageOps
            img = ImageOps.autocontrast(img)
        except Exception:
            pass
        # upscale for better OCR
        w, h = img.size
        if max(w, h) < 1000:
            scale = max(1.5, 1000 / max(w, h))
            img = img.resize((int(w*scale), int(h*scale)))
        # binary threshold
        img = img.point(lambda p: 255 if p > 180 else 0)
        config = '--oem 3 --psm 6'
        text = pytesseract.image_to_string(img, config=config)  # type: ignore
    except Exception as e:
        # Any runtime OCR/PIL error -> treat as optional feature missing
        return JSONResponse({"error": f"OCR processing failed: {e}"}, status_code=501)
    # naive tokenization and fuzzy map to known drugs
    tokens = [t.strip() for t in text.replace("\n", " ").split(" ") if t.strip()]
    found: List[Dict] = []
    for t in tokens[:50]:  # limit
        canon, conf, _ = fuzzy_canonicalize(t, DATA)
        if canon and conf >= 70:
            found.append({"text": t, "drug": canon, "confidence": int(conf)})
    return {"ok": True, "found": found[:10]}


def _self_test():
    # Sanity checks without binding sockets
    assert not DATA.medicines.empty and len(DATA.medicines) >= 100
    c, conf, _ = fuzzy_canonicalize("ipobrufen", DATA)
    assert c == "Ibuprofen" and conf >= 60
    resp = check(CheckRequest(profile=ProfileModel(age=70, weight=60, height=170, diseases=["BP"]), medicines=["Ibuprofen", "Atenolol"]))
    assert resp.get("result", {}).get("risk_level") in {"Low", "Medium", "High"}
    print("✅ All core tests passed – Chikitsāmedhā ready.")


@app.get("/api/health")
def health():
    return {"status": "ok", "time": _dt.datetime.utcnow().isoformat() + "Z", "port": PORT}


@app.get("/api/version")
def version():
    return {"name": "Chikitsāmedhā", "version": "1.0.0", "ui": "React/Vite", "backend": "FastAPI"}


# SPA fallback for client routes
@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404)
    candidate = frontend_dist / full_path if frontend_dist.exists() else None
    if candidate and candidate.exists() and candidate.is_file():
        return FileResponse(str(candidate))
    index = (frontend_dist / "index.html") if frontend_dist.exists() else (frontend_src / "index.html")
    if index.exists():
        return FileResponse(str(index))
    raise HTTPException(status_code=404)


if __name__ == "__main__":
    _self_test()
