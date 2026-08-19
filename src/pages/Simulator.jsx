import { useState, useMemo } from 'react';
import Panel from '../components/Panel';
import DataBadge from '../components/DataBadge';
import { computeRiskScore, narrateRisk } from '../lib/riskEngine';
import { generateRecommendations } from '../lib/recommendations';
import { febBaselineUsdPerBbl } from '../data/priceData';
import { pctChangeFromBaseline } from '../lib/calculations';
import './Simulator.css';

const DEFAULTS = {
  hormuzDisruptionPct: 70,
  crudePrice: 120,
  importDisruptionPct: 20,
  altSupplyAvailabilityPct: 60,
};

export default function Simulator() {
  const [inputs, setInputs] = useState(DEFAULTS);

  const set = (key) => (e) => setInputs((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }));

  const priceChangePct = useMemo(
    () => pctChangeFromBaseline(inputs.crudePrice, febBaselineUsdPerBbl),
    [inputs.crudePrice]
  );

  const risk = useMemo(() => computeRiskScore({
    priceChangePct,
    hormuzDisruptionPct: inputs.hormuzDisruptionPct,
    topSupplierSharePct: 50,
    shippingDisruptionPct: Math.min(100, inputs.importDisruptionPct * 2),
    altSupplyAvailabilityPct: inputs.altSupplyAvailabilityPct,
  }), [inputs, priceChangePct]);

  const recs = useMemo(() => generateRecommendations({
    hormuzDisruptionPct: inputs.hormuzDisruptionPct,
    priceChangePct,
    altSupplyAvailabilityPct: inputs.altSupplyAvailabilityPct,
    importDisruptionPct: inputs.importDisruptionPct,
    riskBand: risk.band,
  }), [inputs, priceChangePct, risk.band]);

  return (
    <div className="simulator">
      <header className="case-study__header">
        <p className="hero__eyebrow">"What If?" simulator</p>
        <h1>Scenario simulation — not an official forecast</h1>
        <p className="case-study__sub">
          Move the sliders to test a hypothetical scenario. Every output below is tagged SIMULATION and is
          computed from your inputs with the same transparent formula used in the Risk Engine.
        </p>
      </header>

      <div className="simulator__layout">
        <Panel eyebrow="Inputs" title="Scenario controls" right={<DataBadge type="SIMULATION" />}>
          <Slider label="Hormuz disruption" unit="%" min={0} max={100} value={inputs.hormuzDisruptionPct} onChange={set('hormuzDisruptionPct')} />
          <Slider label="Crude price" unit="$/bbl" min={50} max={200} value={inputs.crudePrice} onChange={set('crudePrice')} />
          <Slider label="Import disruption" unit="%" min={0} max={50} value={inputs.importDisruptionPct} onChange={set('importDisruptionPct')} />
          <Slider label="Alternative supply availability" unit="%" min={0} max={100} value={inputs.altSupplyAvailabilityPct} onChange={set('altSupplyAvailabilityPct')} />
          <button className="btn btn--ghost sim-reset" onClick={() => setInputs(DEFAULTS)}>Reset to example scenario</button>
        </Panel>

        <Panel eyebrow="Output" title="Projected impact" right={<span className={`band-pill band-pill--${risk.band.toLowerCase()}`}>{risk.band}</span>}>
          <div className="sim-output">
            <div>
              <p className="sim-output__label">Supply risk</p>
              <p className={`sim-output__value band-text--${risk.band.toLowerCase()}`}>{risk.band}</p>
            </div>
            <div>
              <p className="sim-output__label">Price vs. Feb baseline</p>
              <p className="sim-output__value">{priceChangePct > 0 ? '+' : ''}{priceChangePct.toFixed(0)}%</p>
            </div>
            <div>
              <p className="sim-output__label">Score</p>
              <p className="sim-output__value">{risk.score}/100</p>
            </div>
          </div>
          <ul className="drivers">
            {risk.drivers.map((d) => (
              <li key={d.label}>
                <span>{d.label}</span>
                <div className="drivers__bar"><div style={{ width: `${d.value}%` }} /></div>
                <span className="mono">{d.value}</span>
              </li>
            ))}
          </ul>
          <p className="snapshot-note"><DataBadge type="AI_INSIGHT" /> {narrateRisk(risk)}</p>
        </Panel>
      </div>

      <Panel eyebrow="Response" title="Recommended response" right={<DataBadge type="AI_INSIGHT" />}>
        <div className="rec-grid">
          {recs.map((r) => (
            <div key={r.category + r.action} className="rec-card">
              <p className="rec-card__cat mono">{r.category}</p>
              <p className="rec-card__action">{r.action}</p>
              <p className="rec-card__why">Why: {r.why}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Slider({ label, unit, min, max, value, onChange }) {
  return (
    <label className="sim-slider">
      <span className="sim-slider__top">
        <span>{label}</span>
        <span className="mono sim-slider__value">{value}{unit}</span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={onChange} />
    </label>
  );
}
