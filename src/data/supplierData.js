// REAL DATA — India's crude oil supplier mix, pre-crisis vs during the Hormuz shock.
// Figures are as-reported percentages from named sources; "Middle East" during the
// crisis month is approximated by OPEC's share, which is explained in the caveat
// field since not every OPEC barrel is Hormuz-transiting. This is intentionally
// left visible in the UI rather than silently smoothed over.

export const supplierMix = {
  preCrisis: {
    label: 'Pre-crisis (Jan–Feb 2026)',
    segments: [
      { name: 'Middle East (Hormuz-transiting)', pct: 50 },
      { name: 'Russia / CIS', pct: 21 },
      { name: 'Other (Americas, Africa, etc.)', pct: 29 },
    ],
    source: {
      name: 'Middle East Forum / TheGeorgetownDaily reporting (Kpler data)',
      dataset: "India's crude import mix, Jan–Feb 2026",
      period: 'January–February 2026',
      unit: '% of total crude imports',
      url: 'https://www.meforum.org/mef-observer/indias-pivot-to-russian-crude-amid-middle-east-turmoil',
      type: 'News analysis citing Kpler shipping-tracker data',
    },
    caveat: "India imported ~2.6 million b/d via the Strait of Hormuz in Jan–Feb 2026, about half of total supply; Russia's share had fallen below 25% by this period after 2025 sanctions pressure.",
  },
  duringCrisis: {
    label: 'During crisis (March 2026)',
    segments: [
      { name: 'Middle East / OPEC', pct: 29 },
      { name: 'Russia / CIS', pct: 50 },
      { name: 'Other (Americas, Africa, etc.)', pct: 21 },
    ],
    source: {
      name: 'Market data via Baonghean / industry reporting',
      dataset: "India's crude import mix, March 2026",
      period: 'March 2026',
      unit: '% of total crude imports',
      url: 'https://baonghean.vn/en/nhap-khau-dau-an-do-thang-32026-nguon-cung-trung-dong-giam-61-dau-nga-chiem-50-10334445.html',
      type: 'News report, cross-referenced with S&P Global Commodities at Sea',
    },
    caveat: "Middle Eastern supply to India fell ~61% m/m as Hormuz was disrupted; total crude imports fell 13% to ~4.5 million b/d; Russian imports nearly doubled to 2.25 million b/d (50% of the mix); OPEC's collective share hit a record low of ~29%.",
  },
};
