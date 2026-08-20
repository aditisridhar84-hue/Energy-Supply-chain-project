// Adaptive Procurement Orchestrator — AI_INSIGHT layer.
// Ranks risk-map suppliers by a transparent suitability formula and returns the top 3 as
// priority recommendations. The score is a plain weighted formula, not an LLM judgment;
// the "reasons" text is templated from the same inputs shown in the score.

import { riskMapNodes } from '../data/riskMapData';

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

function suitabilityScore(node) {
  // Higher is better: low disruption probability, alternative route available,
  // meaningful existing route dependency (so it's a realistic near-term lever).
  const safetyComponent = 100 - node.disruptionProbabilityPct; // 0-100
  const altBonus = node.alternativeAvailable ? 15 : 0;
  const scaleComponent = Math.min(node.routeDependencyPct, 30); // cap so mega-suppliers don't always win
  return clamp(safetyComponent * 0.6 + altBonus + scaleComponent * 0.5);
}

export function generateProcurementPlan({ hormuzDisruptionPct = 0 } = {}) {
  const ranked = [...riskMapNodes]
    .map((n) => ({ ...n, suitability: suitabilityScore(n) }))
    .sort((a, b) => b.suitability - a.suitability);

  const priorities = ranked.slice(0, 3).map((n, i) => {
    const confidence = Math.round(n.suitability); // reuse suitability as the shown confidence score
    const costImpact = n.riskLevel === 'low' ? 'Low' : n.riskLevel === 'medium' ? 'Moderate' : 'Elevated';
    const reasons = [
      `Disruption probability modelled at ${n.disruptionProbabilityPct}%, ${n.disruptionProbabilityPct < 30 ? 'well below' : n.disruptionProbabilityPct < 55 ? 'below' : 'near'} the current Hormuz disruption level (${hormuzDisruptionPct}%).`,
      n.alternativeAvailable
        ? 'A stated alternative route/bypass exists, giving near-term flexibility.'
        : 'No stated alternative route — treat as a longer-term diversification target, not an immediate lever.',
      `Current route dependency is ${n.routeDependencyPct}% of India's crude mix — large enough to matter, small enough to shift without a major contract renegotiation.`,
    ];
    return {
      priority: i + 1,
      supplierId: n.id,
      supplier: n.name,
      route: n.region,
      risk: n.riskLevel.toUpperCase(),
      costImpact,
      availability: n.alternativeAvailable ? 'Alternative available' : 'Limited alternative',
      reason: n.recommendedAction,
      whyReasons: reasons,
      confidence,
    };
  });

  return priorities;
}
