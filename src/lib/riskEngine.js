// CALCULATED — Geopolitical Supply Risk Score.
// This is a deterministic weighted formula. The LLM/AI layer never picks the score;
// it only narrates the drivers that this function already computed. Weights are
// fixed constants, shown in the UI next to the score.

export const RISK_WEIGHTS = {
  priceShock: 0.30,
  hormuzDisruption: 0.25,
  supplierConcentration: 0.20,
  shippingDisruption: 0.15,
  altSupplyGap: 0.10,
};

// clamp a value into [0, 100]
const clamp = (v) => Math.max(0, Math.min(100, v));

/**
 * @param {object} inputs
 * @param {number} inputs.priceChangePct        % change in crude price vs baseline (can exceed 100)
 * @param {number} inputs.hormuzDisruptionPct    0–100, how disrupted the Strait is
 * @param {number} inputs.topSupplierSharePct    0–100, largest single supplier's share of imports
 * @param {number} inputs.shippingDisruptionPct  0–100, general shipping/logistics disruption
 * @param {number} inputs.altSupplyAvailabilityPct 0–100, availability of alternative suppliers/routes
 */
export function computeRiskScore(inputs) {
  const {
    priceChangePct = 0,
    hormuzDisruptionPct = 0,
    topSupplierSharePct = 33,
    shippingDisruptionPct = 0,
    altSupplyAvailabilityPct = 50,
  } = inputs;

  // Normalize each raw input into a 0-100 "risk contribution" scale.
  const priceShockComponent = clamp(priceChangePct); // 100%+ price rise = maxed out
  const hormuzDisruptionComponent = clamp(hormuzDisruptionPct);
  // Concentration: perfectly diversified (33% each of 3 sources) = 0 risk, monopoly (100%) = 100 risk.
  const supplierConcentrationComponent = clamp(((topSupplierSharePct - 33) / (100 - 33)) * 100);
  const shippingDisruptionComponent = clamp(shippingDisruptionPct);
  const altSupplyGapComponent = clamp(100 - altSupplyAvailabilityPct);

  const weightedScore =
    RISK_WEIGHTS.priceShock * priceShockComponent +
    RISK_WEIGHTS.hormuzDisruption * hormuzDisruptionComponent +
    RISK_WEIGHTS.supplierConcentration * supplierConcentrationComponent +
    RISK_WEIGHTS.shippingDisruption * shippingDisruptionComponent +
    RISK_WEIGHTS.altSupplyGap * altSupplyGapComponent;

  const score = Math.round(clamp(weightedScore));

  let band = 'LOW';
  if (score >= 75) band = 'CRITICAL';
  else if (score >= 50) band = 'HIGH';
  else if (score >= 25) band = 'MODERATE';

  const drivers = [
    { label: 'Crude price shock', value: Math.round(priceShockComponent), weight: RISK_WEIGHTS.priceShock },
    { label: 'Hormuz shipping disruption', value: Math.round(hormuzDisruptionComponent), weight: RISK_WEIGHTS.hormuzDisruption },
    { label: 'Supplier concentration', value: Math.round(supplierConcentrationComponent), weight: RISK_WEIGHTS.supplierConcentration },
    { label: 'General shipping/logistics disruption', value: Math.round(shippingDisruptionComponent), weight: RISK_WEIGHTS.shippingDisruption },
    { label: 'Alternative-supply gap', value: Math.round(altSupplyGapComponent), weight: RISK_WEIGHTS.altSupplyGap },
  ].sort((a, b) => b.value * b.weight - a.value * a.weight);

  return { score, band, drivers };
}

// AI_INSIGHT — plain-language narration of a score the formula already computed.
// Deliberately template-based (not a live LLM call) so the demo is reproducible offline.
export function narrateRisk({ score: _score, band, drivers }) {
  const top = drivers.slice(0, 2).map((d) => d.label.toLowerCase());
  const templates = {
    LOW: `Risk is contained. The largest contributors right now are ${top.join(' and ')}, but none are severe enough to threaten supply continuity.`,
    MODERATE: `Watch conditions. ${top[0]} is the leading driver, with ${top[1]} adding secondary pressure. Worth monitoring but not yet action-forcing.`,
    HIGH: `Elevated exposure. ${top[0]} and ${top[1]} are compounding — this is the point where procurement and reserve planning should actively respond, not just monitor.`,
    CRITICAL: `Severe exposure. ${top[0]} and ${top[1]} are both near their maximum contribution. Treat this as an active-response scenario: diversification and reserve drawdown planning should already be underway.`,
  };
  return templates[band];
}
