// Risk Map node data. Aggregate "Russia/CIS ~50%, Middle East/OPEC ~29%" figures are REAL
// (see src/data/supplierData.js, March 2026). Per-country splits within those blocs,
// disruption probabilities, and "recommended action" text are DEMO/MODELLED illustrative
// values for this prototype — flagged as such rather than presented as observed fact.

export const riskMapNodes = [
  {
    id: 'russia',
    name: 'Russia / CIS',
    region: 'Non-Hormuz',
    riskLevel: 'low',
    routeDependencyPct: 50, // REAL — matches supplierData.duringCrisis "Russia / CIS" share
    routeDependencyType: 'REAL',
    disruptionProbabilityPct: 15,
    disruptionType: 'DEMO',
    alternativeAvailable: true,
    recommendedAction: 'Maintain — already the largest non-Hormuz source and least exposed to the current corridor risk.',
  },
  {
    id: 'middle-east-gulf',
    name: 'Middle East / Gulf (aggregate)',
    region: 'Hormuz-transiting',
    riskLevel: 'high',
    routeDependencyPct: 29, // REAL — matches supplierData.duringCrisis "Middle East / OPEC" share
    routeDependencyType: 'REAL',
    disruptionProbabilityPct: 70,
    disruptionType: 'DEMO',
    alternativeAvailable: true,
    recommendedAction: 'Reduce near-term reliance; prioritize term cargo already contracted, defer discretionary spot purchases.',
  },
  {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    region: 'Hormuz-transiting',
    riskLevel: 'high',
    routeDependencyPct: 12,
    routeDependencyType: 'DEMO',
    disruptionProbabilityPct: 65,
    disruptionType: 'DEMO',
    alternativeAvailable: true,
    recommendedAction: 'Some Red Sea/pipeline export capacity exists (e.g. East-West pipeline) — evaluate as partial Hormuz bypass.',
  },
  {
    id: 'uae',
    name: 'UAE',
    region: 'Partial Hormuz bypass',
    riskLevel: 'medium',
    routeDependencyPct: 8,
    routeDependencyType: 'DEMO',
    disruptionProbabilityPct: 45,
    disruptionType: 'DEMO',
    alternativeAvailable: true,
    recommendedAction: 'Favor over Hormuz-only suppliers — the Fujairah pipeline gives UAE a partial bypass route.',
  },
  {
    id: 'iraq',
    name: 'Iraq',
    region: 'Hormuz-transiting',
    riskLevel: 'high',
    routeDependencyPct: 9,
    routeDependencyType: 'DEMO',
    disruptionProbabilityPct: 68,
    disruptionType: 'DEMO',
    alternativeAvailable: false,
    recommendedAction: 'Limited bypass capacity — treat as high-exposure until Hormuz risk subsides.',
  },
  {
    id: 'united-states',
    name: 'United States',
    region: 'Non-Hormuz',
    riskLevel: 'low',
    routeDependencyPct: 10,
    routeDependencyType: 'DEMO',
    disruptionProbabilityPct: 8,
    disruptionType: 'DEMO',
    alternativeAvailable: true,
    recommendedAction: 'Increase share opportunistically — long transit time but no Hormuz exposure.',
  },
  {
    id: 'latin-america',
    name: 'Latin America',
    region: 'Non-Hormuz',
    riskLevel: 'low',
    routeDependencyPct: 11,
    routeDependencyType: 'DEMO',
    disruptionProbabilityPct: 10,
    disruptionType: 'DEMO',
    alternativeAvailable: true,
    recommendedAction: 'Maintain — diversification benefit, monitor Panama Canal draft restrictions as a secondary logistics risk.',
  },
];

export const riskMapNote =
  'Aggregate bloc shares (Russia/CIS, Middle East/OPEC) are real March 2026 reported figures. ' +
  'Individual-country splits and disruption probabilities are demo estimates for this prototype — ' +
  'a production build would source these from AIS shipping data and a sanctions/news risk feed.';
