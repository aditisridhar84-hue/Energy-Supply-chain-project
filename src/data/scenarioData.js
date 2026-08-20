// Scenario presets. "maxPriceImpactPct" for HORMUZ is calibrated to the REAL peak price
// move seen in the case study (Apr 2026: +66% vs Feb baseline) at severity ~90%, not invented
// from nothing — see the note field on each preset. All other max values are demo/illustrative,
// clearly flagged, and used only as inputs to a transparent formula (src/lib/scenarioEngine.js).

export const SCENARIOS = {
  NORMAL: {
    key: 'NORMAL',
    label: 'Normal Operations',
    maxHormuzDisruptionPct: 0,
    maxRedSeaDisruptionPct: 0,
    maxPriceImpactPct: 0,
    maxSupplyGapPct: 0,
    note: 'Baseline — no active corridor disruption.',
  },
  HORMUZ: {
    key: 'HORMUZ',
    label: 'Hormuz Disruption',
    maxHormuzDisruptionPct: 100,
    maxRedSeaDisruptionPct: 10,
    maxPriceImpactPct: 73, // calibrated: real Apr 2026 peak was +66% at an estimated ~90% severity
    maxSupplyGapPct: 29, // matches the real Middle East/OPEC share exposed to Hormuz transit
    note: 'Calibrated against the real 2026 case study: peak severity approximates the actual April 2026 shock.',
  },
  RED_SEA: {
    key: 'RED_SEA',
    label: 'Red Sea Disruption',
    maxHormuzDisruptionPct: 5,
    maxRedSeaDisruptionPct: 100,
    maxPriceImpactPct: 22,
    maxSupplyGapPct: 6,
    note: 'Demo/illustrative — Red Sea disruption mainly raises freight cost and reroute time rather than cutting India-bound Hormuz supply directly.',
  },
  SEVERE_MULTI: {
    key: 'SEVERE_MULTI',
    label: 'Severe Multi-Corridor Disruption',
    maxHormuzDisruptionPct: 95,
    maxRedSeaDisruptionPct: 90,
    maxPriceImpactPct: 95,
    maxSupplyGapPct: 38,
    note: 'Demo/illustrative worst case — both corridors disrupted simultaneously, compounding effects.',
  },
};

export const SCENARIO_ORDER = ['NORMAL', 'HORMUZ', 'RED_SEA', 'SEVERE_MULTI'];
