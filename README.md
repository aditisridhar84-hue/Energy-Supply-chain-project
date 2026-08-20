# INDIA ENERGY RESILIENCE

AI-powered geopolitical risk and procurement decision-support prototype, built around the real
2026 Strait of Hormuz crisis. **Frontend-only, no backend required** — deploys straight from
this repo to Vercel, Netlify, or GitHub Pages.

```
LIVE RISK → ECONOMIC IMPACT → AI RECOMMENDATION
```

Challenge statement: *"Design an AI-powered system that continuously monitors geopolitical and
logistics risk, models disruption scenarios and their economic impact, and generates executable
procurement rerouting recommendations."* This prototype implements the first three of the five
illustrative directions in full (Geopolitical Risk Intelligence, Disruption Scenario Modelling,
Adaptive Procurement Orchestration) and intentionally keeps Strategic Reserve and the Digital
Twin lightweight — a "Reserve coverage" indicator and a simplified Risk Map stand in for them,
rather than overbuilding for a 5-day prototype.

## Pages

- **Dashboard** — the whole flow on one screen: KPI strip → Geopolitical & Supply Risk Map →
  What-If Disruption Simulator → AI Procurement Recommendation → Resilience Score → Data &
  Methodology.
- **2026 Hormuz Case Study** — the real, sourced case study (event timeline, month-by-month
  Indian Basket price, import-cost exposure, supplier diversification) that the Dashboard's
  models are calibrated against.

## DEMO MODE

This is a 5-day hackathon prototype (`DEMO_MODE = true` in `src/config/demoConfig.js`). Real
prices and the Hormuz case-study figures are genuine sourced readings; country-level disruption
probabilities, route-dependency percentages, and confidence scores are illustrative demo values
pending live feeds. Every number in the UI carries a badge — **Live/Observed**, **Modelled**,
**AI Insight**, or **Demo Data** — so nothing demo is ever presented as observed fact. See the
"Data & Methodology" section at the bottom of the Dashboard for the full breakdown, and
`src/config/demoConfig.js` for the single source of truth on what's real vs. demo.

## Architecture

- **React + Vite**, no router library — two tabs via simple state in `src/App.jsx`.
- **`src/config/demoConfig.js`** — the one place that declares demo mode and lists what a
  production build would connect to (oil price APIs, AIS shipping data, sanctions feeds, etc.).
- **`src/data/`** — all raw numbers, each REAL entry with `source: { name, dataset, period,
  unit, url, type }`. Swap in a live feed here without touching any component.
  - `priceData.js` — Brent + Indian Basket monthly series (real, cited)
  - `supplierData.js` — pre-crisis vs. during-crisis supplier mix (real, cited)
  - `riskMapData.js` — per-country risk-map nodes (aggregate shares real, per-country detail demo)
  - `scenarioData.js` — What-If scenario presets, price-impact ceiling calibrated to the real
    April 2026 shock
- **`src/lib/`** — pure calculation functions, no black boxes:
  - `riskEngine.js` — transparent weighted Geopolitical Supply Risk Score
  - `scenarioEngine.js` — turns (scenario, severity%) into supply gap / price / cost / refinery risk
  - `resilienceScore.js` — 5-component India Energy Resilience Score
  - `recommendations.js` — ranks risk-map suppliers into the Priority 1/2/3 procurement plan
  - `calculations.js` — % change from baseline, import cost estimate
- **`src/components/dashboard/`** — KPICard, RiskMap, ScenarioSimulator, ProcurementOrchestrator,
  ResilienceScore, DataMethodology.
- **`src/components/`** — shared UI: DataBadge, Provenance, Panel, NavBar, PriceTimelineChart,
  SupplierMixChart.

## Run locally

```bash
npm install
npm run dev
npm run build   # production build, output in dist/
```

## Deploy (pick one — all free)

**Vercel (recommended):** push to GitHub → vercel.com → "Add New Project" → import repo →
framework auto-detected as Vite → Deploy.

**Netlify:** push to GitHub → app.netlify.com → "Add new site" → build command `npm run build`,
publish directory `dist`.

**GitHub Pages:** add `base: '/<your-repo-name>/'` to `vite.config.js`, `npm run build`, deploy
`dist/` via the `gh-pages` package or GitHub's "Deploy from a branch" setting.
