import { supplierMix } from '../data/supplierData';
import { riskMapNodes } from '../data/riskMapData';

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

// Reserve coverage is deliberately a flat demo score, NOT presented as India's actual
// strategic reserve position (see src/data/reserveData.js for the sourcing caveat this
// mirrors). Flagged DEMO in the UI.
const DEMO_RESERVE_COVERAGE_SCORE = 62;

export function computeResilienceScore({ hormuzDisruptionPct = 0, redSeaDisruptionPct = 0, priceImpactPct = 0 } = {}) {
  // Supply diversity — CALCULATED from real supplierMix.duringCrisis shares.
  const topShare = Math.max(...supplierMix.duringCrisis.segments.map((s) => s.pct));
  const concentrationPenalty = clamp(((topShare - 33) / (100 - 33)) * 100);
  const supplyDiversity = Math.round(100 - concentrationPenalty);

  // Route diversity — CALCULATED from demo risk-map node data (share of nodes with a
  // stated alternative available).
  const withAlt = riskMapNodes.filter((n) => n.alternativeAvailable).length;
  const routeDiversity = Math.round((withAlt / riskMapNodes.length) * 100);

  // Geopolitical exposure (higher = safer) — MODELLED from current scenario inputs.
  const geopoliticalExposure = Math.round(clamp(100 - (hormuzDisruptionPct * 0.55 + redSeaDisruptionPct * 0.25)));

  // Price exposure (higher = safer) — MODELLED from current scenario price impact.
  const priceExposure = Math.round(clamp(100 - priceImpactPct));

  // Reserve coverage — DEMO flat score, see constant above.
  const reserveCoverage = DEMO_RESERVE_COVERAGE_SCORE;

  const components = [
    { key: 'supplyDiversity', label: 'Supply diversity', value: supplyDiversity, type: 'CALCULATED' },
    { key: 'routeDiversity', label: 'Route diversity', value: routeDiversity, type: 'CALCULATED' },
    { key: 'geopoliticalExposure', label: 'Geopolitical exposure', value: geopoliticalExposure, type: 'CALCULATED' },
    { key: 'priceExposure', label: 'Price exposure', value: priceExposure, type: 'CALCULATED' },
    { key: 'reserveCoverage', label: 'Reserve coverage', value: reserveCoverage, type: 'DEMO' },
  ];

  const overall = Math.round(components.reduce((sum, c) => sum + c.value, 0) / components.length);

  return { overall, components };
}
