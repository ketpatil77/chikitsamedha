from __future__ import annotations

from typing import Dict, List, Tuple

import pandas as pd

from .data_loader import DataBundle

MRISK = {
    "Safe": "सुरक्षित",
    "Moderate": "मध्यम धोका",
    "High": "उच्च धोका",
    "Contraindicated": "वर्ज्य",
}

def severity_to_score(name: str) -> float:
    n = str(name or '').upper()
    return {"LOW": 25.0, "CAUTION": 60.0, "HIGH": 85.0, "CONTRAINDICATED": 100.0}.get(n, 0.0)

def level_from_overall(overall: float, contraindicated: bool) -> str:
    if contraindicated:
        return "Contraindicated"
    if overall >= 85:
        return "High"
    if overall >= 60:
        return "Moderate"
    return "Safe"

def evaluate_risk(meds: List[str], profile: Dict, data: DataBundle, *, contexts: List[str]|None=None, simple_mode: bool=False) -> Dict:
    meds = meds or []
    contexts = contexts or []
    drugs_lower = [m.lower() for m in meds]
    
    # Drug-drug risk (sum of known pairs)
    pair_risk = 0.0
    reasons_en: List[str] = []
    reasons_mr: List[str] = []
    rules_applied: List[str] = []
    inter = data.interactions
    for i in range(len(meds)):
        for j in range(i+1, len(meds)):
            a, b = _pair_key(meds[i], meds[j])
            r = inter[(inter['drug_a'].str.lower()==a.lower()) & (inter['drug_b'].str.lower()==b.lower())]
            if not r.empty:
                row = r.iloc[0]
                rd = float(row.get('risk_delta', 0) or 0)
                pair_risk += max(0.0, rd)
                exp = str(row.get('explanation', '') or '').strip()
                if exp:
                    reasons_en.append(f"{a}+{b}: {exp}")
                    reasons_mr.append(f"{a}+{b}: {exp}")
                    rules_applied.append(f"pair:{a}+{b}")
    pair_risk = max(0.0, min(100.0, pair_risk))

    # Drug-disease risk
    disease_risk = 0.0
    dis = data.diseases
    disease_contra = False
    for d in set(profile.get('diseases', []) or []):
        for m in meds:
            rows = dis[(dis['disease'].str.lower()==str(d).lower()) & (dis['drug'].str.lower()==m.lower())]
            for _, row in rows.iterrows():
                disease_risk += float(row.get('risk_delta', 0) or 0)
                exp = str(row.get('explanation', '') or '').strip()
                if exp:
                    reasons_en.append(f"{m} with {d}: {exp}")
                    reasons_mr.append(f"{m} with {d}: {exp}")
                    rules_applied.append(f"disease:{d}:{m}")
                    if 'contraindicated' in exp.lower():
                        disease_contra = True
    disease_risk = max(0.0, min(100.0, disease_risk))

    # Age guardrails via contraindications
    ci = apply_contraindications(profile, meds, data.contra, simple=simple_mode)
    age_dim = 0.0
    if ci['max_severity']:
        age_dim = severity_to_score(ci['max_severity'])
        if ci['explanations_en']:
            reasons_en.append(ci['explanations_en'])
        if ci['explanations_mr']:
            reasons_mr.append(ci['explanations_mr'])
        rules_applied.append(f"age:{ci['max_severity']}")
    # Elderly + NSAID heuristic
    try:
        age = float(profile.get('age') or 0)
    except Exception:
        age = 0.0
    nsaids = {"Ibuprofen","Diclofenac","Naproxen","Ketorolac","Aceclofenac","Etoricoxib"}
    if age >= 65 and any(m in nsaids for m in meds):
        age_dim = max(age_dim, 70.0)
        reasons_en.append("Elderly (≥65) with NSAID: higher GI/renal risk")
        reasons_mr.append("वृद्ध वय (६५+) आणि NSAID: जठर/मूत्रपिंड धोका जास्त")
        rules_applied.append("age:elderly_nsaid")

    # Context risk
    ctx = apply_context_rules(contexts, meds, data.contexts, simple=simple_mode)
    context_dim = float(ctx.get('risk') or 0.0)
    if ctx.get('explanations_en'): reasons_en.append(ctx['explanations_en'])
    if ctx.get('explanations_mr'): reasons_mr.append(ctx['explanations_mr'])
    if context_dim: rules_applied.append('context')

    # Heuristic: any statin + Grapefruit => high context risk if not already
    cl = {c.strip().lower() for c in contexts}
    dl = [m.strip().lower() for m in meds]
    if 'grapefruit' in cl and any(m.endswith('statin') or m in {'atorvastatin','simvastatin','lovastatin','rosuvastatin','pravastatin'} for m in dl):
        if context_dim < 85.0:
            context_dim = 85.0
            reasons_en.append('Grapefruit increases statin levels — avoid')
            reasons_mr.append('ग्रेपफ्रूट स्टॅटिनचे प्रमाण वाढवते — टाळा')
            rules_applied.append('context:grapefruit_statin')

    # Normalize dimensions
    dd = max(0.0, min(100.0, pair_risk))
    disd = max(0.0, min(100.0, disease_risk))
    aged = max(0.0, min(100.0, age_dim))
    ctxd = max(0.0, min(100.0, context_dim))

    # Weighted overall
    weights = { 'drug': 0.45, 'disease': 0.25, 'age': 0.15, 'context': 0.15 }
    overall = dd*weights['drug'] + disd*weights['disease'] + aged*weights['age'] + ctxd*weights['context']
    contraindicated = (ci.get('max_severity') == 'CONTRAINDICATED') or disease_contra
    if contraindicated:
        overall = 100.0

    overall = round(max(0.0, min(100.0, overall)), 1)
    level = level_from_overall(overall, contraindicated)
    return {
        'risk_profile': { 'drug': round(dd,1), 'disease': round(disd,1), 'age': round(aged,1), 'context': round(ctxd,1), 'overall': overall },
        'risk_level': level,
        'risk_level_mr': MRISK.get(level, level),
        'contraindicated': contraindicated,
        'explanations_list': { 'en': list(dict.fromkeys(reasons_en)), 'mr': list(dict.fromkeys(reasons_mr)) },
        'explanations_simple': { 'en_simple': list(dict.fromkeys(reasons_en)), 'mr_simple': list(dict.fromkeys(reasons_mr)) },
        'used': { 'rules_applied': rules_applied },
    }


def compute_bmi(weight_kg, height_cm):
    try:
        h = float(height_cm) / 100.0
        if h <= 0:
            return None
        return round(float(weight_kg) / (h * h), 1)
    except Exception:
        return None


def risk_level_from_score(score: float) -> str:
    if score <= 20:
        return "Low"
    if score <= 40:
        return "Medium"
    return "High"


def _pair_key(a: str, b: str) -> Tuple[str, str]:
    a1, b1 = sorted([a, b])
    return a1, b1


def select_text(row, key: str, simple: bool) -> str:
    if simple:
        val = row.get(f"{key}_simple")
        if isinstance(val, str) and val.strip():
            return str(val).strip()
    return str(row.get(key, "")).strip()


def apply_contraindications(patient: Dict, drugs: List[str], contra_df: pd.DataFrame, *, simple: bool = False) -> Dict[str, object]:
    if contra_df is None or contra_df.empty:
        return {"flags": [], "explanations_en": "", "explanations_mr": "", "max_severity": ""}
    flags: List[str] = []
    exp_en: List[str] = []
    exp_mr: List[str] = []
    severity_rank = {"CONTRAINDICATED": 3, "HIGH": 2, "CAUTION": 1}
    max_severity: str | None = None
    try:
        age = float(patient.get("age") or 0)
    except Exception:
        age = 0.0
    viral = bool(patient.get("viral_illness") or False)

    def bool_val(val) -> bool:
        return str(val).strip().lower() in {"1", "true", "yes"}

    for drug in drugs:
        rows = contra_df[contra_df["drug"].str.lower() == drug.lower()]
        for _, r in rows.iterrows():
            scope = str(r.get("scope", "")).lower()
            rule = str(r.get("rule", "")).lower()
            sev = str(r.get("severity", "")).upper()
            threshold = r.get("threshold")
            triggered = False

            if scope == "age" and pd.notna(threshold):
                try:
                    thr = float(threshold)
                except Exception:
                    thr = None
                if thr is not None:
                    if rule == "lt" and age < thr:
                        triggered = True
                    elif rule == "le" and age <= thr:
                        triggered = True
            elif scope == "viral_illness" and rule == "eq":
                thr_bool = bool_val(threshold)
                if viral == thr_bool:
                    triggered = True

            if triggered:
                exp_en.append(select_text(r, "en", simple))
                exp_mr.append(select_text(r, "mr", simple))
                flags.append(f"{drug}:{sev}")
                current = severity_rank.get(sev, 0)
                if max_severity is None or current > severity_rank.get(max_severity, 0):
                    max_severity = sev

    def dedup(seq: List[str]) -> str:
        seen = []
        for item in seq:
            if item and item not in seen:
                seen.append(item)
        return " ".join(seen).strip()

    return {
        "flags": flags,
        "explanations_en": dedup(exp_en),
        "explanations_mr": dedup(exp_mr),
        "max_severity": max_severity or "",
    }


def apply_context_rules(selected_contexts: List[str], drugs: List[str], ctx_df: pd.DataFrame, *, simple: bool = False) -> Dict[str, object]:
    if not selected_contexts or ctx_df is None or ctx_df.empty:
        return {"risk": 0.0, "explanations_en": "", "explanations_mr": ""}
    drug_set = {d.lower() for d in drugs}
    contexts = {c.strip().lower() for c in selected_contexts if c}
    if not contexts or not drug_set:
        return {"risk": 0.0, "explanations_en": "", "explanations_mr": ""}
    severity_score = {"LOW": 25.0, "CAUTION": 60.0, "HIGH": 85.0, "CONTRAINDICATED": 100.0}
    total_risk = 0.0
    exp_en: List[str] = []
    exp_mr: List[str] = []
    for _, row in ctx_df.iterrows():
        ctx = str(row.get("context", "")).strip().lower()
        drug = str(row.get("drug", "")).strip().lower()
        if ctx in contexts and (drug in drug_set or drug == "*"):
            sev = str(row.get("severity", "LOW")).upper()
            total_risk += severity_score.get(sev, 10.0)
            exp_en.append(select_text(row, "en", simple))
            exp_mr.append(select_text(row, "mr", simple))
    def dedup(seq: List[str]) -> str:
        out = []
        for item in seq:
            if item and item not in out:
                out.append(item)
        return " ".join(out).strip()
    return {
        "risk": max(0.0, min(100.0, total_risk)),
        "explanations_en": dedup(exp_en),
        "explanations_mr": dedup(exp_mr),
    }


def aggregate_interactions(
    meds: List[str],
    profile: Dict,
    data: DataBundle,
    *,
    contexts: List[str] | None = None,
    simple_mode: bool = False,
) -> Dict:
    # Base from pairwise rules
    rules = data.interactions
    diseases = data.diseases

    pair_risk = 0.0
    disease_risk = 0.0
    age_bmi_risk = 0.0
    eff_delta = 0.0
    notes_en: List[str] = []
    notes_mr: List[str] = []

    def add_note(text: str):
        txt = str(text).strip()
        if txt:
            notes_en.append(txt)
            notes_mr.append(txt)

    # Pairwise aggregation
    for i in range(len(meds)):
        for j in range(i + 1, len(meds)):
            a, b = _pair_key(meds[i], meds[j])
            r = rules[(rules["drug_a"].str.lower() == a.lower()) & (rules["drug_b"].str.lower() == b.lower())]
            if not r.empty:
                rr = r.iloc[0]
                pair_risk += float(rr.get("risk_delta", 0) or 0)
                eff_delta += float(rr.get("effect_delta", 0) or 0)
                exp = str(rr.get("explanation", "")).strip()
                if exp:
                    add_note(f"{a}+{b}: {exp}")
            else:
                pair_risk += 8.0  # fallback minor risk per unknown pair
                add_note(f"{a}+{b}: no known major interaction (fallback)")

    # Disease modifiers
    conds = set(profile.get("diseases", []) or profile.get("conditions", []) or [])
    for d in conds:
        for m in meds:
            dr = diseases[(diseases["disease"].str.lower() == str(d).lower()) & (diseases["drug"].str.lower() == m.lower())]
            if not dr.empty:
                for _, rr in dr.iterrows():
                    disease_risk += float(rr.get("risk_delta", 0) or 0)
                    eff_delta += float(rr.get("effect_delta", 0) or 0)
                    e = str(rr.get("explanation", "")).strip()
                    if e:
                        add_note(f"{m} with {d}: {e}")

    # Age & BMI
    try:
        age = float(profile.get("age", 0) or 0)
        if age >= 65:
            age_bmi_risk += 10
            add_note("Age ≥ 65 increases risk")
    except Exception:
        pass

    bmi = compute_bmi(profile.get("weight"), profile.get("height"))
    if bmi is not None:
        if bmi < 18.5:
            age_bmi_risk += 5
            add_note("Underweight (BMI < 18.5)")
        elif bmi >= 30:
            age_bmi_risk += 5
            add_note("Obesity (BMI ≥ 30)")

    base_risk = pair_risk + disease_risk + age_bmi_risk
    risk = max(0.0, min(100.0, base_risk))
    effectiveness = max(0.0, min(100.0, 100.0 + eff_delta - 0.3 * risk))
    level = risk_level_from_score(risk)

    ci = apply_contraindications(profile, meds, data.contra, simple=simple_mode)
    ctx_info = apply_context_rules(contexts or [], meds, data.contexts, simple=simple_mode)
    explanations_en = notes_en.copy()
    explanations_mr = notes_mr.copy()
    if ci["explanations_en"]:
        explanations_en.append(ci["explanations_en"])
    if ci["explanations_mr"]:
        explanations_mr.append(ci["explanations_mr"])

    if ci["max_severity"] == "CONTRAINDICATED":
        risk = 98.0
        level = "Contraindicated"
    elif ci["max_severity"] == "HIGH":
        risk = max(risk, 75.0)
        level = risk_level_from_score(risk)
    elif ci["max_severity"] == "CAUTION":
        risk = max(risk, 50.0)
        level = risk_level_from_score(risk)

    context_risk = ctx_info.get("risk", 0.0)
    if context_risk:
        risk = max(risk, min(100.0, context_risk))
        if ctx_info["explanations_en"]:
            explanations_en.append(ctx_info["explanations_en"])
        if ctx_info["explanations_mr"]:
            explanations_mr.append(ctx_info["explanations_mr"])

    # Simple alternatives heuristic
    alternatives = compute_alternatives(meds, data)
    contra_flag = ci.get("max_severity") == "CONTRAINDICATED"
    risk_breakdown = {
        "pair_rule": round(pair_risk, 1),
        "disease": round(disease_risk, 1),
        "age_bmi": round(age_bmi_risk, 1),
        "contra": 98.0 if contra_flag else 0.0,
    }
    drug_risk = max(0.0, min(100.0, base_risk))
    risk_profile = {
        "drug": round(drug_risk, 1),
        "context": round(context_risk, 1),
        "overall": round(risk, 1),
    }
    return {
        "drugs": meds,
        "risk_score": round(risk, 1),
        "effectiveness_score": round(effectiveness, 1),
        "risk_level": level,
        "explanation": " ".join(explanations_en).strip(),
        "explanations": {
            "en": " ".join(explanations_en).strip(),
            "mr": " ".join(explanations_mr).strip(),
        },
        "contraindicated": contra_flag,
        "risk_breakdown": risk_breakdown,
        "risk_profile": risk_profile,
        "context_risk": round(context_risk, 1),
        "alternatives": alternatives,
        "contra_flags": ci.get("flags", []),
        "used": meds,
    }


def compute_alternatives(meds: List[str], data: DataBundle) -> List[Dict]:
    """Return simple replacement suggestions for common risky combos.

    Heuristics (minimal, offline):
    - If NSAID (Ibuprofen, Diclofenac, Naproxen) with beta‑blocker (Atenolol, Metoprolol, Bisoprolol, Carvedilol): suggest Paracetamol instead of the NSAID.
    - If Tramadol with SSRI (Sertraline, Escitalopram, Fluoxetine): suggest Paracetamol instead of Tramadol.
    """
    beta_blockers = {"Atenolol", "Metoprolol", "Bisoprolol", "Carvedilol"}
    nsaids = {"Ibuprofen", "Diclofenac", "Naproxen", "Ketorolac", "Aceclofenac", "Etoricoxib"}
    ssri = {"Sertraline", "Escitalopram", "Fluoxetine"}
    suggestions: List[Dict] = []
    s = set(meds)
    if s & nsaids and s & beta_blockers:
        bad = list(s & nsaids)[0]
        suggestions.append({"replace": bad, "with": "Paracetamol", "reason": "Safer with BP medicines"})
    if "Tramadol" in s and s & ssri:
        suggestions.append({"replace": "Tramadol", "with": "Paracetamol", "reason": "Avoid serotonergic combo with SSRI"})
    return suggestions
