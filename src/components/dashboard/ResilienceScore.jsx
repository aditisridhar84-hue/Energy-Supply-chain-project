import DataBadge from '../DataBadge';
import { computeResilienceScore } from '../../lib/resilienceScore';
import './ResilienceScore.css';

export default function ResilienceScorePanel({ scenarioResult }) {
  const { overall, components } = computeResilienceScore({
    hormuzDisruptionPct: scenarioResult?.hormuzDisruptionPct ?? 0,
    redSeaDisruptionPct: scenarioResult?.redSeaDisruptionPct ?? 0,
    priceImpactPct: scenarioResult?.priceImpactPct ?? 0,
  });

  let band = 'low';
  if (overall >= 75) band = 'high';
  else if (overall >= 50) band = 'moderate';

  return (
    <div className="resilience">
      <div className="resilience__headline">
        <div>
          <p className="resilience__label">India Energy Resilience Score <DataBadge type="CALCULATED" /></p>
          <p className={`resilience__score resilience__score--${band}`}>{overall}<span>/100</span></p>
        </div>
        <p className="resilience__hint">Recalculates live as you move the scenario simulator above.</p>
      </div>
      <div className="resilience__components">
        {components.map((c) => (
          <div key={c.key} className="resilience-row">
            <span className="resilience-row__label">{c.label}</span>
            <div className="resilience-row__bar"><div style={{ width: `${c.value}%` }} /></div>
            <span className="resilience-row__value mono">{c.value}</span>
            <DataBadge type={c.type} />
          </div>
        ))}
      </div>
    </div>
  );
}
