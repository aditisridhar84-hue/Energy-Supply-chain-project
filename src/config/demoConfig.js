// Centralized prototype config. This is the ONLY place that declares "we're in demo mode"
// and the ONLY place that lists what a production version would connect to. Nothing about
// demo mode is scattered into components — they just read DATA_TYPES tags per value.

export const DEMO_MODE = true;

export const DEMO_MODE_NOTE =
  '5-day hackathon prototype. Prices and the 2026 Hormuz case-study figures are real, sourced ' +
  'readings (see badges/citations throughout). Country-level disruption probabilities, route ' +
  'dependency %, and confidence scores are illustrative demo values pending live feeds — never ' +
  'presented as observed fact.';

// "Data & Methodology" section — the categories of sources a production build would consume,
// and what this prototype currently uses instead. No source here is claimed to have been
// live-accessed unless it's REAL data elsewhere in the app with its own citation.
export const DATA_SOURCE_CATEGORIES = [
  {
    category: 'Oil price data',
    productionSource: 'ICE Brent futures / EIA spot price API',
    prototypeStatus: 'REAL',
    note: 'Brent and Indian Basket snapshots used in this prototype are real, dated readings — see Overview and Case Study citations.',
  },
  {
    category: 'Shipping / maritime data',
    productionSource: 'AIS vessel tracking (e.g. Kpler, MarineTraffic), port throughput data',
    prototypeStatus: 'DEMO',
    note: 'Route dependency % and disruption probabilities on the Risk Map are illustrative, not pulled from a live AIS feed.',
  },
  {
    category: 'Geopolitical news',
    productionSource: 'News/wire APIs (Reuters, AP) + event-extraction pipeline',
    prototypeStatus: 'REAL (manual)',
    note: 'The 2026 Hormuz timeline was manually compiled and cited from named news sources — not a live news feed.',
  },
  {
    category: 'Sanctions data',
    productionSource: 'OFAC / UN / EU sanctions list APIs',
    prototypeStatus: 'DEMO',
    note: 'Not integrated in this prototype. Flagged as a direct extension point.',
  },
  {
    category: 'Import data',
    productionSource: 'PPAC import/export bulletins, national customs data',
    prototypeStatus: 'REAL (partial)',
    note: "Supplier mix (pre-crisis vs. during-crisis) is real, cited data. PPAC's own historical download requires an account login, so it isn't live-connected — see README.",
  },
  {
    category: 'Government energy data',
    productionSource: 'PPAC, Ministry of Petroleum & Natural Gas, Lok Sabha replies',
    prototypeStatus: 'REAL',
    note: 'April/July 2026 basket prices are official Government of India figures cited directly.',
  },
];
