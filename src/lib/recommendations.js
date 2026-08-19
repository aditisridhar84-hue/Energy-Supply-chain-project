// AI_INSIGHT — rule-based recommendation generator. Every recommendation states the
// input threshold that triggered it, so nothing here is a black-box LLM judgment.

export function generateRecommendations({ hormuzDisruptionPct, priceChangePct, altSupplyAvailabilityPct, importDisruptionPct, riskBand }) {
  const recs = [];

  if (hormuzDisruptionPct >= 40 || riskBand === 'HIGH' || riskBand === 'CRITICAL') {
    recs.push({
      category: 'Supplier diversification',
      action: 'Increase procurement from non-Hormuz-dependent suppliers (Russia/CIS, the Americas, West Africa).',
      why: `Hormuz disruption is modeled at ${hormuzDisruptionPct}%, which the scenario treats as a direct reduction in Hormuz-dependent supply reliability.`,
    });
  }

  if (priceChangePct >= 30) {
    recs.push({
      category: 'Procurement',
      action: 'Lock in term contracts at pre-shock benchmarks where possible; reduce reliance on spot purchases.',
      why: `Modeled crude price is ${priceChangePct.toFixed(0)}% above the February baseline — spot exposure at this level compounds cost volatility.`,
    });
  }

  if (altSupplyAvailabilityPct < 50) {
    recs.push({
      category: 'Shipping/routing',
      action: 'Evaluate alternative routes and ports (e.g. west-coast discharge, pipeline-fed refineries) that reduce Hormuz transit dependency.',
      why: `Alternative supply availability is modeled at only ${altSupplyAvailabilityPct}%, meaning route flexibility is currently limited.`,
    });
  }

  if (importDisruptionPct >= 15 || riskBand === 'CRITICAL') {
    recs.push({
      category: 'Strategic reserves',
      action: 'Prepare for phased strategic reserve drawdown and confirm replenishment contracts are pre-negotiated.',
      why: `Import disruption is modeled at ${importDisruptionPct}%, which the reserve stress test treats as demand that reserves would need to backfill.`,
    });
  }

  recs.push({
    category: 'Refinery planning',
    action: 'Assess refinery configuration flexibility for processing a wider range of crude grades (sour/sweet mix shift).',
    why: 'A more diversified supplier mix typically means a wider range of crude grades arriving at port, which refineries need to be able to process without a margin penalty.',
  });

  recs.push({
    category: 'Monitoring',
    action: 'Track Hormuz transit volumes and Indian Basket price daily rather than relying on monthly averages during active disruption.',
    why: riskBand === 'CRITICAL' || riskBand === 'HIGH'
      ? 'At this risk level, monthly averages lag real conditions enough to delay procurement decisions.'
      : 'Even at lower risk, daily monitoring is the cheapest way to catch an escalation early.',
  });

  return recs;
}
