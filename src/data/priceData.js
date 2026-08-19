// REAL DATA — curated snapshot, not live-fetched.
// Every entry has full provenance so it can be swapped for a live PPAC/EIA feed later
// without touching any UI component. See src/lib/dataSource.js for the swap point.
//
// IMPORTANT: PPAC (ppac.gov.in) publishes the authoritative "International Prices of
// Crude Oil (Indian Basket)" dataset, but historical downloads require a free login,
// so exact daily series could not be pulled directly. Figures below are drawn from
// official Government of India statements (Lok Sabha replies) and rating-agency
// research notes that themselves cite PPAC as the primary source. Two months (May,
// June 2026) could not be independently verified at the time of writing and are left
// as `null` rather than estimated — see `verified` flag on each entry.

export const indianCrudeBasketMonthly = [
  {
    month: 'Feb 2026',
    priceUsdPerBbl: 69.0,
    verified: true,
    phase: 'PRE-CONFLICT',
    note: 'Pre-conflict baseline, monthly average.',
    source: {
      name: 'ICRA Research',
      dataset: 'West Asia conflict-led spike in crude and energy prices',
      period: 'February 2026 (monthly average)',
      unit: 'USD/barrel',
      url: 'https://www.icra.in/Research/ViewResearchReport/6840',
      type: 'Secondary source citing PPAC-based Indian Basket data',
    },
  },
  {
    month: 'Mar 2026',
    priceUsdPerBbl: 125.7,
    verified: true,
    phase: 'CONFLICT SHOCK',
    note: 'Partial-month average (Mar 1–25, 2026), reported during the acute shock.',
    source: {
      name: 'ICRA Research',
      dataset: 'West Asia conflict-led spike in crude and energy prices',
      period: 'March 1–25, 2026 (partial-month average)',
      unit: 'USD/barrel',
      url: 'https://www.icra.in/Research/ViewResearchReport/6840',
      type: 'Secondary source citing PPAC-based Indian Basket data',
    },
  },
  {
    month: 'Apr 2026',
    priceUsdPerBbl: 114.5,
    verified: true,
    phase: 'CONFLICT SHOCK',
    note: 'Peak monthly average cited by the Government of India in Parliament.',
    source: {
      name: 'Ministry of Finance (Lok Sabha reply)',
      dataset: "Minister of State for Finance statement on India's average crude basket price",
      period: 'April 2026 (monthly average)',
      unit: 'USD/barrel',
      url: 'https://www.millenniumpost.in/business/indias-average-crude-oil-basket-price-falls-to-776bbl-in-july-from-1145-in-april-govt-669984',
      type: 'Official — Government of India statement',
    },
  },
  {
    month: 'May 2026',
    priceUsdPerBbl: null,
    verified: false,
    phase: 'CONFLICT SHOCK',
    note: 'Monthly average not independently verified — PPAC historical download requires login. Do not estimate; connect a live PPAC feed to fill this in.',
    source: null,
  },
  {
    month: 'Jun 2026',
    priceUsdPerBbl: null,
    verified: false,
    phase: 'PARTIAL EASING',
    note: 'Monthly average not independently verified. Context only: Brent (not the Indian Basket) fell below $70/bbl in mid-June 2026 after the US–Iran ceasefire framework and MOU (J.P. Morgan Global Research).',
    source: null,
  },
  {
    month: 'Jul 2026',
    priceUsdPerBbl: 77.6,
    verified: true,
    phase: 'PARTIAL EASING',
    note: 'Partial-month average (up to Jul 22, 2026), cited by the Government of India in Parliament.',
    source: {
      name: 'Ministry of Finance (Lok Sabha reply)',
      dataset: "Minister of State for Finance statement on India's average crude basket price",
      period: 'July 1–22, 2026 (partial-month average)',
      unit: 'USD/barrel',
      url: 'https://www.millenniumpost.in/business/indias-average-crude-oil-basket-price-falls-to-776bbl-in-july-from-1145-in-april-govt-669984',
      type: 'Official — Government of India statement',
    },
  },
  {
    month: 'Aug 2026',
    priceUsdPerBbl: 91.6,
    verified: true,
    phase: 'CURRENT RISK',
    note: 'Latest available daily spot reading (not a monthly average) — renewed uncertainty as the June MOU truce window lapsed.',
    source: {
      name: 'India Macro Indicators',
      dataset: 'Crude Oil Price (Indian Basket)',
      period: '13 August 2026 (daily spot)',
      unit: 'USD/barrel',
      url: 'https://indiamacroindicators.co.in/economic-indicators/crude-oil-price-indian-basket',
      type: 'Tracking site, sourced from PPAC daily release',
    },
  },
];

export const febBaselineUsdPerBbl = indianCrudeBasketMonthly[0].priceUsdPerBbl;

export const brentSnapshot = {
  priceUsdPerBbl: 91.02,
  asOf: '19 August 2026',
  source: {
    name: 'Oilprice.com',
    dataset: 'Brent Crude Oil Futures Contracts',
    period: '19 August 2026 (spot)',
    unit: 'USD/barrel',
    url: 'https://oilprice.com/futures/brent/',
    type: 'Market data',
  },
};

export const hormuzTimeline = [
  { date: '28 Feb 2026', label: 'US–Israel strikes on Iran begin; Iran declares the Strait closed', phase: 'PRE-CONFLICT → SHOCK' },
  { date: '19 Mar 2026', label: 'US aerial campaign to reopen the Strait begins', phase: 'CONFLICT SHOCK' },
  { date: '7–8 Apr 2026', label: 'First US–Iran ceasefire agreed', phase: 'CONFLICT SHOCK' },
  { date: '13 Apr–29 May 2026', label: 'US naval blockade of Iranian ports', phase: 'CONFLICT SHOCK' },
  { date: 'Jun 2026', label: 'US–Iran memorandum of understanding (MOU) signed; 60-day truce window opens', phase: 'PARTIAL EASING' },
  { date: '6–7 Jul 2026', label: 'Iran attacks three ships; truce effectively collapses', phase: 'PARTIAL EASING → RISK' },
  { date: '17 Aug 2026', label: 'June MOU truce window formally expires', phase: 'CURRENT RISK' },
];

export const timelineSourceNote = {
  name: 'Wikipedia / Congress.gov CRS / Britannica / CNN (cross-referenced)',
  url: 'https://en.wikipedia.org/wiki/2026_Strait_of_Hormuz_crisis',
  type: 'News/reference, cross-checked across multiple outlets',
};
