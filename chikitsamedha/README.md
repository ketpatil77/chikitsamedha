# 🧠 Chikitsāmedhā – Transparent Intelligence for Safer Medicine

## 📘 Overview
Chikitsāmedhā is an **offline, explainable-AI web app** built with **Streamlit** and powered by **rule-based logic** rather than black-box machine learning.  
It helps users — especially pharmacy students and healthcare practitioners — check **drug–drug interactions**, **disease conflicts**, and **side effects** in clear, simple language.

The system does **not collect or upload personal data**. It focuses on **transparency**, **education**, and **offline safety analysis**.

---

## 🎯 Core Features
- 👤 **User Profile Form**
  - Inputs: name, age, weight, height, blood group, disease (BP / Diabetes)
- 💊 **Medicine Input**
  - Fuzzy search (RapidFuzz) for drug names
  - Synonym recognition and spelling correction
- ⚕️ **Interaction Checker**
  - Checks for conflict between two medicines
  - Adjusts results based on user diseases
  - Displays human-readable risk explanation
- 📊 **Visual Output**
  - Pie charts for risk and effectiveness
  - Text-based explanation for safety
- 📄 **Report Generator**
  - Exports results as PDF (via ReportLab)
  - Includes user info, medicines, and visual charts

---

## 🧬 Example Medicines in Prototype
| Medicine | Purpose | Common Risks | Notes |
|-----------|----------|---------------|-------|
| **Paracetamol** | Fever, Pain relief | Liver strain at high dose | Safe in BP/Diabetes |
| **Ibuprofen** | Pain, Inflammation | Raises BP, irritates stomach | Caution in BP |
| **Atenolol** | Blood pressure control | Lowers HR, fatigue | Avoid with other BP drugs |
| **Cetirizine** | Allergy relief | Drowsiness | Safe with Paracetamol |

---

## ⚖️ Example Interactions
| Combo | Risk | Description |
|--------|------|-------------|
| Paracetamol + Ibuprofen | ✅ Safe (short term) | Common combo, monitor stomach health |
| Ibuprofen + Atenolol | ❌ Unsafe | Ibuprofen may reduce BP medicine effect |
| Paracetamol + Cetirizine | ⚠️ Mild | Causes drowsiness |
| Atenolol + Cetirizine | ✅ Safe | No significant effect |

---

## 💻 Technology Stack
| Layer | Tools |
|-------|-------|
| Frontend | Streamlit |
| Fuzzy Matching | RapidFuzz |
| Visualization | Matplotlib |
| PDF Generation | ReportLab |
| OCR (planned) | Pytesseract |
| AI Assistant | GitHub Copilot (Codex) |

---

## ⚙️ Workflow
1. User enters personal info (age, blood group, diseases)
2. User types one or two medicine names
3. App normalizes names → finds matches → applies rule-based logic
4. App displays:
   - Risk Level (Low / Medium / High)
   - Plain-language explanation
   - Effectiveness/Risk pie charts
   - PDF download button
5. User can save and share the report

---

## 🧠 Explainable AI Principle
Chikitsāmedhā is designed around **transparent reasoning**, where every result includes a **“Why”**:
> “Ibuprofen reduces the BP-lowering effect of Atenolol by affecting kidney-mediated sodium retention.”

No black-box ML — every step is rule-based and explainable.

---

## 🔮 Future Enhancements
- 🔊 Marathi + English voice narration (Text-to-Speech)
- 🌐 Interactive graph of drug–enzyme–effect relationships
- 🧩 Auto-learning layer for unknown drug interactions
- 🗃️ SQLite database for faster queries
- 🎓 Educational mode for pharmacy students

---

## 👩‍💻 Project Architecture



chikitsamedha/
│
├── app.py # Streamlit main app (runs locally)
├── README.md # Project overview (this file)
├── requirements.txt # Dependencies list
├── assets/ # Optional icons, images, Lottie animations
├── data/
│ └── drug_rules.csv # Drug–drug interaction knowledge base
└── utils/
├── interaction_rules.py # Logic for interactions
├── medicine_data.py # Drug dictionary
└── pdf_generator.py # ReportLab export


---

## 🧩 Development Notes for Codex
- Codex should generate **clean, readable Streamlit code**.
- All text must be **human-friendly** (no technical jargon).
- Comments should clearly describe logic.
- The app should **run offline**, avoiding API dependencies.
- Use **RapidFuzz** for fuzzy name matching.
- Charts via **Matplotlib**, not Plotly.
- Avoid complex machine learning — keep it rule-based and explainable.

---

## 📋 Example Run
1. `streamlit run app.py`
2. Fill user profile → select diseases
3. Enter two medicines (e.g. Ibuprofen, Atenolol)
4. Click “Check Safety”
5. View explanation + charts
6. Download PDF

---

## ⚙️ Dependencies
```bash
pip install streamlit rapidfuzz reportlab pillow pytesseract matplotlib pandas
```

🧾 License

Open educational prototype – for learning and research purposes only.
No medical claims. Always consult a healthcare professional before taking medication.

