import Panel from '../components/Panel';
import DataBadge from '../components/DataBadge';
import { RISK_WEIGHTS, computeRiskScore, narrateRisk } from '../lib/riskEngine';
import { pctChangeFromBaseline } from '../lib/calculations';
import { febBaselineUsdPerBbl } from '../data/priceData';
import './RiskEngine.css';

const SNAPSHOTS = [
  {
    label: 'Feb 2026 — Pre-conflict',
    inputs: { priceChangePct: 0, hormuzDisruptionPct: 0, topSupplierSharePct: 50, shippingDisruptionPct: 5, altSupplyAvailabilityPct: 70 },
    note: 'Price change is REAL (0 by definition, the baseline). Other inputs are AI-estimated for illustration — Hormuz was open and shipping normal.',
  },
  {
    label: 'Apr 2026 — Peak shock',
    inputs: { priceChangePct: pctChangeFromBaseline(114.5, febBaselineUsdPerBbl), hormuzDisruptionPct: 90, topSupplierSharePct: 50, shippingDisruptionPct: 85, altSupplyAvailabilityPct: 35 },
    note: 'Price change is CALCULATED from official Apr 2026 data. Hormuz/shipping/supply inputs are AI-estimated from the reported blockade and >60% drop in Middle Eastern supply.',
  },
  {
    label: 'Aug 2026 — Current',
    inputs: { priceChangePct: pctChangeFromBaseline(91.6, febBaselineUsdPerBbl), hormuzDisruptionPct: 55, topSupplierSharePct: 50, shippingDisruptionPct: 45, altSupplyAvailabilityPct: 55 },
    note: 'Price change is CALCULATED from the latest REAL spot reading. Hormuz/shipping inputs are AI-estimated from reporting that Gulf producers are routing around, not through, a fully open Strait.',
  },
];

export default function RiskEngine() {
  return (
    <div className="risk-engine">
      <header className="case-study__header">
        <p className="hero__eyebrow">Geopolitical Supply Risk Score</p>
        <h1>A formula, not a guess</h1>
        <p className="case-study__sub">
          The score below is a fixed weighted sum. The AI layer only narrates the drivers this formula already
          computed — it never chooses the score itself.
        </p>
      </header>

      <Panel eyebrow="Formula" title="Weights (fixed, shown in full)" right={<DataBadge type="CALCULATED" />}>
        <div className="weights">
          {Object.entries(RISK_WEIGHTS).map(([k, v]) => (
            <div key={k} className="weights__row">
              <span className="weights__key mono">{k}</span>
              <div className="weights__bar"><div style={{ width: `${v * 100}%` }} /></div>
              <span className="weights__val mono">{Math.round(v * 100)}%</span>
            </div>
          ))}
        </div>
        <p className="case-study__formula mono">
          score = Σ(weight × normalized component), clamped to 0–100. Bands: LOW &lt;25, MODERATE 25–49, HIGH 50–74, CRITICAL ≥75.
        </p>
      </Panel>

      <div className="snapshot-grid">
        {SNAPSHOTS.map((s) => {
          const result = computeRiskScore(s.inputs);
          return (
            <Panel key={s.label} eyebrow={s.label} title={`Score: ${result.score} / 100`} right={<span className={`band-pill band-pill--${result.band.toLowerCase()}`}>{result.band}</span>}>
              <ul className="drivers">
                {result.drivers.map((d) => (
                  <li key={d.label}>
                    <span>{d.label}</span>
                    <div className="drivers__bar"><div style={{ width: `${d.value}%` }} /></div>
                    <span className="mono">{d.value}</span>
                  </li>
                ))}
              </ul>
              <p className="snapshot-note"><DataBadge type="AI_INSIGHT" /> {narrateRisk(result)}</p>
              <p className="case-study__hint">{s.note}</p>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
