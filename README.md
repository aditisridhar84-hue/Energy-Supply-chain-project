# Fairway — India Petroleum Supply-Chain Resilience

A prototype that traces India's exposure to the 2026 Strait of Hormuz crisis end to end:

```
Geopolitical event → Supply-chain disruption → Crude price shock →
India's import cost → Alternative suppliers/routes → Refinery & logistics risk →
AI-generated (rule-based) recommendation
```

Built for a hackathon/college submission. **Frontend-only, no backend required** — deploys
straight from this repo to Vercel, Netlify, or GitHub Pages.

## What's in the app

| Page | What it shows |
|---|---|
| **Overview** | Live-style instrument panel (Brent, Indian Basket, % vs. baseline, illustrative risk score) + signature price-shock chart |
| **2026 Hormuz Crisis — India Impact** | Dedicated case study: event timeline, month-by-month Indian Basket price with % change, import-cost exposure calculator, supplier-diversification before/during comparison |
| **Risk Engine** | The transparent, weighted **Geopolitical Supply Risk Score** formula, applied to three real snapshots (pre-conflict, peak shock, current) |
| **What If? Simulator** | Sliders for Hormuz disruption, crude price, import disruption, and alternative-supply availability → projected risk band + rule-based recommendations |
| **Routes** | Simplified supplier → shipping route → port → refinery → distribution network, with Hormuz-dependent legs flagged high-risk |
| **Reserve** | Strategic Reserve Stress Test — a fully transparent calculator that uses only numbers you enter, never assumed official figures |

## Data provenance — how to read every number

Every figure in the app carries one of five tags (see `src/data/dataTypes.js`), shown as a
small colored badge next to the number:

- **REAL** — retrieved from a named official/primary source
- **CALCULATED** — a transparent formula applied to REAL data (formula is always shown)
- **SIMULATION** — your own hypothetical input, explicitly labeled "not an official forecast"
- **AI INSIGHT** — plain-language narration of a score/recommendation a formula already computed (never a black-box judgment)
- **FORECAST** — a third-party or model-generated prediction, cited to its source

`src/data/priceData.js` and `src/data/supplierData.js` contain the curated dataset used for
the case study, each entry with `source: { name, dataset, period, unit, url, type }`. Two
months (May–June 2026) are intentionally left as `null` rather than invented, because the
PPAC historical download requires a login and no other verified monthly average could be
found at the time of writing — see the note on each entry.

### Known data-source limitation

[PPAC](https://ppac.gov.in/) (Petroleum Planning & Analysis Cell, Ministry of Petroleum &
Natural Gas) is the authoritative source for the Indian Basket crude price and import/export
data, but its historical dataset downloads sit behind a free account signup, so this
prototype could not pull a live daily/monthly series directly. Instead it uses:

- Official Government of India statements (Lok Sabha replies) for April and July 2026
- A rating-agency research note (ICRA) that itself cites PPAC-based figures for Feb/Mar 2026
- A PPAC-sourced tracking site for the latest August 2026 spot reading

**To connect a live feed later:** replace the arrays in `src/data/priceData.js` and
`src/data/supplierData.js` with data fetched from a PPAC account, EIA's API, or a market-data
provider. No other file needs to change — every component reads from these two files only.

## Architecture

- **React + Vite**, no router library (simple tab state in `src/App.jsx`) — keeps the bundle
  small and deploy config trivial.
- **`src/data/`** — the only place raw numbers live. Swap in a live feed here.
- **`src/lib/`** — pure calculation functions (`riskEngine.js`, `calculations.js`,
  `recommendations.js`). Every formula is a few readable lines with the weights/logic visible
  in the file — nothing is an opaque LLM call.
- **`src/components/`** — shared UI: `DataBadge`, `Provenance`, `Panel`, `NavBar`,
  `PriceTimelineChart`, `SupplierMixChart`.
- **`src/pages/`** — one file per tab.

## Run locally

```bash
npm install
npm run dev
```

## Deploy (pick one — all are free)

### Option A — Vercel (recommended, easiest)
1. Push this folder to a new GitHub repository.
2. Go to vercel.com, "Add New Project", import the repo.
3. Framework preset: **Vite**. Leave build command (`npm run build`) and output dir (`dist`)
   as detected. Click Deploy.

### Option B — Netlify
1. Push to GitHub.
2. app.netlify.com → "Add new site" → "Import an existing project".
3. Build command: `npm run build`. Publish directory: `dist`.

### Option C — GitHub Pages
1. Push to GitHub.
2. In `vite.config.js`, add `base: '/<your-repo-name>/'`.
3. `npm run build`, then deploy the `dist/` folder using the `gh-pages` npm package or
   GitHub's "Deploy from a branch" Pages setting pointed at a `gh-pages` branch.

## Scalability notes (for judges)

- Data layer is fully decoupled from UI — a live PPAC/EIA/Kpler feed can be dropped in behind
  `src/data/*.js` without touching components.
- Risk scoring is a pure function (`computeRiskScore`), so it can move server-side or into an
  edge function unchanged if this grows past a static site.
- Recommendation generation is rule-based today (`src/lib/recommendations.js`); it's written
  so the same input/output shape could be handed to a real LLM call later without changing
  any component that consumes it.
