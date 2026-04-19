───────────────────────────────────────────────────────────────
⚡ CHIKITSĀMEDHĀ — FUTURISTIC WEB UI MASTER PROMPT (Frontend Auto-Build)
───────────────────────────────────────────────────────────────
🎨 ROLE
You are Codex, a senior front-end engineer + motion designer.
Build a **futuristic, premium, animated** web UI for Chikitsāmedhā that feels
professional, royal, and highly usable. This is a full replacement of the UI.

───────────────────────────────────────────────────────────────
🧱 TECH STACK (STRICT)
• React + Vite
• Tailwind CSS (design tokens + themes)
• Framer Motion (animations/micro-interactions)
• Chart.js (donut, bar, area)
• Lucide icons (SVG)
• (Optional) Lottie for subtle hero/empty states

Offline only. No external APIs. All data via our backend endpoints or local mocks.

───────────────────────────────────────────────────────────────
🌈 BRAND & VISUAL IDENTITY
• “Royal Futurism” aesthetic: clean, medical-trust + luxury tech
• Primary: Emerald #0EA47A
• Deep Green: #0B3B2E
• Royal Gold: #C9A227
• Ink Black: #0C0F14
• Cloud White: #F6F8FB
• Accent Gradients:
  - G1: linear(120deg, #0EA47A 0%, #19B394 40%, #6BE9C2 100%)
  - G2: linear(135deg, #1A1F2C 0%, #0B3B2E 50%, #0EA47A 100%)
• Glassmorphism: backdrop-blur-xl, bg-white/10, border-white/15
• Depth: soft ambient shadow (rgba(14,164,122,0.25), 0 20px 60px)
• Radii: rounded-2xl for cards; rounded-full for pills
• Typography:
  - Display: “Playfair Display” (royal), fallback serif
  - UI: “Inter” for clarity, fallback system-ui
• Iconography: Lucide; stroke=1.75 for elegance
• Dark/Light themes: auto + manual toggle

───────────────────────────────────────────────────────────────
⚙️ IA / ROUTES
/ (Home) — hero, quick scan, highlights
/check — multi-medicine checker
/scan — OCR wrapper upload
/report — review & export PDF
/about — project + safety disclaimer

Persistent top navbar; contextual left rail on /check.

───────────────────────────────────────────────────────────────
🧩 CORE SCREENS & COMPONENTS (BUILD ALL)

1) NAVBAR (always visible)
   • Left: logo + “Chikitsāmedhā” wordmark (Playfair)
   • Center: global search (type medicine → suggestions)
   • Right: Language toggle (EN/🇮🇳 MR), Theme toggle, Help (modal)
   • Sticky, translucent glass, subtle gradient bottom border

2) HOME / HERO
   • Gradient hero with animated organic blobs + faint grid
   • Headline: “Transparent Intelligence for Safer Medicine”
   • CTA buttons: “Start Check”, “Scan Wrapper”
   • Stats strip: “100+ medicines • Offline • Explainable”
   • Micro-motion on hover; 60–100ms easeOut

3) CHECK (primary workflow)
   • Left rail card: “User Profile”
     - fields: Name, Age, Weight, Height, Blood Group, Conditions (BP/Diabetes)
     - compact, pill inputs, save state locally
   • Main panel card: “Medicines”
     - Multi-select up to 5 drugs (chips). Search with fuzzy suggestions.
     - Add/Remove + re-order chips with drag
     - Suggest safer alternatives inline if a risky pair is chosen
   • Action row: [Analyze Safety] (primary), [Explain], [Speak], [Export PDF]
   • Results zone (animated in):
     a) Risk Level badge: 🟢 Safe / 🟡 Caution / 🔴 Unsafe
     b) Donut charts: Effectiveness vs Risk (Chart.js; spring ease)
     c) Explanation tray (expandable): plain English + Marathi
     d) Mechanism mini-graph (static SVG with pulsing nodes)
     e) Alternatives carousel (card swipe) when unsafe
   • Toasts for state changes

4) SCAN (OCR)
   • Drag-drop file zone (glassmorphism), preview, “Extract text”
   • Detected candidates → selectable chips to add into /check
   • Empty state Lottie animation

5) REPORT
   • Read-only view of the latest analysis
   • Download PDF, Copy link (local deep-link), Print
   • Share disclaimer box (non-medical advice)

6) ABOUT
   • Mission, ethics, explainable AI note
   • Credits, version, offline guarantee

───────────────────────────────────────────────────────────────
🗣️ BILINGUAL CONTENT
• Language toggle (EN / Marathi). Keep a local dictionary object.
• Example keys:
  - “Analyze Safety”: { en: "Analyze Safety", mr: "सुरक्षितता तपासा" }
  - “Risk Level”: { en: "Risk Level", mr: "जोखमीचा स्तर" }
  - Keep tone simple; medical Hindi/Marathi understandable for rural users.

───────────────────────────────────────────────────────────────
🎞️ MOTION SYSTEM (Framer Motion)
• Page transition: fade+slide 12px, 200ms, easeOut
• Cards on enter: spring, stiffness 140, damping 18, 60ms stagger
• Buttons: subtle scale 1.02 on hover, 1.06 on tap
• Chips: ripple on add/remove
• Blobs: slow parallax, opacity 0.1–0.2
• Confetti burst (discreet) on “Safe” outcomes

───────────────────────────────────────────────────────────────
📊 CHARTS (Chart.js)
• Donut: Effectiveness (good%) vs Remaining; Risk (risk%) vs Safe
• Bar: “Potential Mechanism Overlap” (optional)
• Colors derive from tokens (primary, gold, danger)
• Accessible: aria-labels + data tables for SR

───────────────────────────────────────────────────────────────
🧰 COMPONENT LIBRARY (to implement)
• <Badge>, <PillInput>, <Card>, <Stat>, <Donut>, <BarChart>
• <LangToggle>, <ThemeToggle>, <Toast>, <Modal>, <SidePanel>
• <WrapperDropzone>, <ChipsSelector>, <AltCarousel>

───────────────────────────────────────────────────────────────
🔒 ACCESSIBILITY
• WCAG AA contrast
• Keyboard nav for chips, toggles, dialogs
• Prefers-reduced-motion respected
• Aria labels on critical elements

───────────────────────────────────────────────────────────────
🧪 QA / AUTO TESTS (Cypress or Playwright)
• Renders navbar and hero
• Add 3 medicines and run analysis → charts visible
• Toggle language → labels switch
• Upload image on /scan → candidates appear
• Generate PDF → blob exists
• Local storage persists profile

───────────────────────────────────────────────────────────────
📦 FILES TO GENERATE (FRONTEND)
frontend/
  index.html
  vite.config.ts
  package.json (react, react-dom, tailwind, framer-motion, chart.js, lucide-react, @headlessui/react)
  postcss.config.cjs, tailwind.config.cjs
  src/
    main.tsx, App.tsx, routes.tsx
    i18n.ts (simple EN/MR dictionary)
    lib/theme.ts (tokens)
    components/* (all components above)
    pages/
      Home.tsx, Check.tsx, Scan.tsx, Report.tsx, About.tsx
    charts/Donut.tsx, charts/Bar.tsx
    assets/logo.svg, blobs.svg, lotties/*
  public/favicon.svg

Provide minimal CSS variables and Tailwind plugin config for glass + shadows.

───────────────────────────────────────────────────────────────
📡 BACKEND CONTRACT (assume existing FastAPI/Flask endpoints)
GET  /api/medicines        → list of drugs for autocomplete
POST /api/check            → { profile, medicines[] } → { risk, effectiveness, explain, alternatives[] }
POST /api/ocr              → multipart image → { candidates[] }
POST /api/pdf              → { report } → returns PDF blob
If endpoints not available, create local mocks in /src/mocks and switch easily.

───────────────────────────────────────────────────────────────
✅ ACCEPTANCE CRITERIA
• UI feels premium, animated, and professional (not default).
• Works offline, responsive from 360px to 1440px+.
• Multi-medicine up to 5 with chips; suggestions feel instant.
• Bilingual toggle works everywhere.
• Charts + explanation animate cleanly; no jank < 60fps.
• Lighthouse Performance ≥ 85, Accessibility ≥ 95.
• On first build, show demo with mocked data if backend is absent.
• Print to console when done:
  "✅ Chikitsāmedhā Futuristic UI built and verified."
───────────────────────────────────────────────────────────────

What to do now

Create frontend/README_UI_BRIEF.md and paste the prompt above.

Open each blank file Codex suggests (it’ll start generating React + Tailwind project).

Accept completions (Tab) as Codex writes your components, pages, and theme.

Run it:

cd frontend
npm install
npm run dev


Open http://localhost:5173.

