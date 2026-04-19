import io
import os
import sys
import importlib.util


def load_module_from_path(path: str):
    spec = importlib.util.spec_from_file_location("chikitsamedha_app", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load module from {path}")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main() -> int:
    app_path = os.path.join(os.path.dirname(__file__), "..", "chikitsamedha", "app.py")
    app_path = os.path.abspath(app_path)
    mod = load_module_from_path(app_path)

    # Load data and run self tests
    data = mod.load_data()
    assert mod.self_test(data) is True, "self_test returned False"
    print("[OK] self_test() passed")

    # Fuzzy matching check
    syn_map = mod.build_synonym_map(data["synonyms"])
    known = data["drugs"]["drug"].tolist()
    canon, conf, sugg = mod.canonicalize("ipobrufen", syn_map, known)
    assert canon == "Ibuprofen" and conf >= 60, f"Fuzzy failed: {canon}, {conf}"
    print("[OK] fuzzy match for 'ipobrufen' -> Ibuprofen")

    # Interaction check
    profile = {"conditions": ["BP"], "age": 70, "weight": 60, "height": 170, "name": "Test", "blood_group": "O+"}
    res = mod.check_interaction("Ibuprofen", "Atenolol", profile, data)
    assert res.get("mode") == "pair" and res.get("risk_level") in {"Low", "Medium", "High"}
    print(f"[OK] rule-based check -> risk={res.get('risk_level')} score={res.get('risk_score')}")

    # Charts generation
    eff_img = mod.pie_chart("Effective", float(res.get("effectiveness_score", 75.0)), ("#147d64", "#def2ed"))
    risk_pct = max(0.0, 100.0 - float(res.get("risk_score", 25.0)))
    risk_img = mod.pie_chart("Safe", risk_pct, ("#c9a227", "#f6efdb"))
    assert isinstance(eff_img, io.BytesIO) and eff_img.getbuffer().nbytes > 0
    assert isinstance(risk_img, io.BytesIO) and risk_img.getbuffer().nbytes > 0
    print("[OK] pie charts generated")

    # PDF generation
    pdf_bytes = mod.generate_pdf_report(profile, "Ibuprofen", "Atenolol", res, eff_img, risk_img)
    assert isinstance(pdf_bytes, (bytes, bytearray)) and len(pdf_bytes) > 0
    print("[OK] PDF generated (bytes)")

    print("✅ Core logic verified without starting server.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

