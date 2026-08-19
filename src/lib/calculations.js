// CALCULATED — small, transparent formulas. No black boxes: every function here is
// short enough to read top to bottom, and every UI element that shows its output
// is labeled "Calculated from ..." rather than presented as an official statistic.

/** % change from the February 2026 pre-conflict baseline. */
export function pctChangeFromBaseline(currentPrice, baselinePrice) {
  if (currentPrice == null || baselinePrice == null || baselinePrice === 0) return null;
  return ((currentPrice - baselinePrice) / baselinePrice) * 100;
}

/**
 * Estimated import cost exposure = import volume (barrels) x crude price (USD/bbl).
 * This is a stated estimate, not an official import-bill figure. Assumptions are
 * surfaced back to the caller so the UI can print them next to the number.
 */
export function estimateImportCost({ volumeMillionBblPerDay, priceUsdPerBbl, days = 30 }) {
  if (!volumeMillionBblPerDay || !priceUsdPerBbl) return null;
  const totalBbl = volumeMillionBblPerDay * 1_000_000 * days;
  const totalUsd = totalBbl * priceUsdPerBbl;
  return {
    totalUsd,
    totalUsdBillion: totalUsd / 1_000_000_000,
    assumptions: [
      `Import volume held constant at ${volumeMillionBblPerDay} million barrels/day across the period`,
      `${days}-day period`,
      `Price applied uniformly at $${priceUsdPerBbl}/bbl (does not model day-to-day price movement within the period)`,
      'Excludes freight, insurance, refining, and duty — crude cost only',
    ],
  };
}

/**
 * Strategic reserve stress test.
 * daysOfCoverage = currentReserveDays adjusted for a consumption change implied by
 * import disruption (less imported crude available -> reserve drawn down faster
 * if domestic demand doesn't fall proportionally).
 */
export function reserveStressTest({ currentReserveDays, dailyConsumption, importDisruptionPct }) {
  if (!currentReserveDays || !dailyConsumption) return null;
  const disruptionFraction = (importDisruptionPct || 0) / 100;
  // Effective daily draw increases as a fraction of normal imports is lost and reserves
  // must fill the gap, up to the point where the whole disruption is being backfilled by reserves.
  const effectiveDailyDraw = dailyConsumption * (1 + disruptionFraction);
  const impliedCoverageDays = effectiveDailyDraw > 0
    ? (currentReserveDays * dailyConsumption) / effectiveDailyDraw
    : currentReserveDays;

  let status = 'SAFE';
  if (impliedCoverageDays < 7) status = 'CRITICAL';
  else if (impliedCoverageDays < 15) status = 'HIGH RISK';
  else if (impliedCoverageDays < 30) status = 'WATCH';

  return {
    impliedCoverageDays: Math.round(impliedCoverageDays * 10) / 10,
    status,
    assumptions: [
      'Assumes domestic consumption stays constant while a share of imports is disrupted',
      'Reserves are assumed to backfill the disrupted share of imports 1:1',
      'Does not model emergency demand reduction, rationing, or new spot purchases',
    ],
  };
}
