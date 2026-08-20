import { SCENARIOS } from '../data/scenarioData';
import { febBaselineUsdPerBbl } from '../data/priceData';
import { estimateImportCost } from './calculations';

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/**
 * Scale a scenario's max values by the severity slider (0-100%).
 */
export function computeScenario(scenarioKey, severityPct) {
  const scenario = SCENARIOS[scenarioKey] || SCENARIOS.NORMAL;
  const s = clamp(severityPct) / 100;

  const hormuzDisruptionPct = Math.round(scenario.maxHormuzDisruptionPct * s);
  const redSeaDisruptionPct = Math.round(scenario.maxRedSeaDisruptionPct * s);
  const priceImpactPct = Math.round(scenario.maxPriceImpactPct * s * 10) / 10;
  const supplyGapPct = Math.round(scenario.maxSupplyGapPct * s * 10) / 10;

  const priceUsdPerBbl = Math.round(febBaselineUsdPerBbl * (1 + priceImpactPct / 100) * 10) / 10;

  const importCost = estimateImportCost({ volumeMillionBblPerDay: 4.5, priceUsdPerBbl, days: 30 });
  const baselineCost = estimateImportCost({ volumeMillionBblPerDay: 4.5, priceUsdPerBbl: febBaselineUsdPerBbl, days: 30 });
  const importCostImpactUsdBillion = importCost && baselineCost
    ? Math.round((importCost.totalUsdBillion - baselineCost.totalUsdBillion) * 100) / 100
    : 0;

  let refineryRisk = 'LOW';
  if (supplyGapPct >= 25) refineryRisk = 'CRITICAL';
  else if (supplyGapPct >= 15) refineryRisk = 'HIGH';
  else if (supplyGapPct >= 5) refineryRisk = 'MEDIUM';

  return {
    scenario,
    severityPct: clamp(severityPct),
    hormuzDisruptionPct,
    redSeaDisruptionPct,
    priceImpactPct,
    priceUsdPerBbl,
    supplyGapPct,
    importCostImpactUsdBillion,
    refineryRisk,
  };
}

export function refineryRiskColor(level) {
  return { LOW: '#35ADA6', MEDIUM: '#E8A33D', HIGH: '#D06246', CRITICAL: '#D06246' }[level] || '#8A93AC';
}
