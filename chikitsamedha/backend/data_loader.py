from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

import pandas as pd
from rapidfuzz import fuzz, process


@dataclass
class DataBundle:
    medicines: pd.DataFrame
    interactions: pd.DataFrame
    diseases: pd.DataFrame
    synonyms: pd.DataFrame
    contra: pd.DataFrame
    contexts: pd.DataFrame


def load_contraindications(path: Path) -> pd.DataFrame:
    p = path / "contraindications.csv"
    if not p.exists():
        return pd.DataFrame(columns=["drug", "scope", "rule", "threshold", "severity", "en", "mr", "en_simple", "mr_simple"])
    df = pd.read_csv(p)
    for col in ["drug", "scope", "rule", "severity", "en", "mr"]:
        if col in df.columns:
            df[col] = df[col].astype(str)
    return df


def load_context_rules(path: Path) -> pd.DataFrame:
    p = path / "context_rules.csv"
    if not p.exists():
        return pd.DataFrame(columns=["context", "drug", "severity", "en", "mr", "en_simple", "mr_simple"])
    df = pd.read_csv(p)
    for col in ["context", "drug", "severity", "en", "mr"]:
        if col in df.columns:
            df[col] = df[col].astype(str)
    return df


def load_data(data_dir: Path) -> DataBundle:
    data_dir.mkdir(parents=True, exist_ok=True)
    meds = pd.read_csv(data_dir / "medicines.csv")
    inter = pd.read_csv(data_dir / "interactions.csv")
    dis = pd.read_csv(data_dir / "diseases.csv")
    syn = pd.read_csv(data_dir / "synonyms.csv")
    contra = load_contraindications(data_dir)
    contexts = load_context_rules(data_dir)
    # Normalize string columns
    for c in ["drug", "drug_a", "drug_b", "disease", "synonym", "canonical"]:
        for df in [meds, inter, dis, syn]:
            if c in df.columns:
                df[c] = df[c].astype(str)
    return DataBundle(medicines=meds, interactions=inter, diseases=dis, synonyms=syn, contra=contra, contexts=contexts)


def build_choices(data: DataBundle) -> List[str]:
    choices = set(data.medicines["drug"].tolist())
    for _, r in data.synonyms.iterrows():
        choices.add(r["synonym"].strip())
    return sorted(choices)


def _synonym_map(data: DataBundle) -> Dict[str, str]:
    mp: Dict[str, str] = {}
    for _, r in data.synonyms.iterrows():
        mp[r["synonym"].strip().lower()] = r["canonical"].strip()
    return mp


def synonyms_list(data: DataBundle) -> List[Dict[str, str]]:
    """Return a list of {synonym, canonical} for clients that want to hydrate local search."""
    out: List[Dict[str, str]] = []
    for _, r in data.synonyms.iterrows():
        out.append({"synonym": str(r["synonym"]).strip(), "canonical": str(r["canonical"]).strip()})
    return out


def fuzzy_canonicalize(raw: str, data: DataBundle) -> Tuple[str | None, float, List[Tuple[str, float]]]:
    if not raw:
        return None, 0.0, []
    raw_s = str(raw).strip()
    low = raw_s.lower()
    syn = _synonym_map(data)
    known = data.medicines["drug"].tolist()
    if low in syn:
        return syn[low], 100.0, [(syn[low], 100.0)]
    if raw_s in known:
        return raw_s, 100.0, [(raw_s, 100.0)]
    choices = known + list(syn.keys())
    results = process.extract(raw_s, choices, scorer=fuzz.WRatio, limit=5)
    best = None
    best_score = 0.0
    sugg: List[Tuple[str, float]] = []
    for label, score, _ in results:
        if str(label).lower() in syn:
            canon = syn[str(label).lower()]
        else:
            canon = str(label)
        sugg.append((canon, float(score)))
        if score > best_score:
            best = canon
            best_score = float(score)
    if best_score >= 60:
        return best, best_score, sugg
    return None, best_score, sugg
