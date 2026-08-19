import { useState, useMemo } from 'react';
import Panel from '../components/Panel';
import DataBadge from '../components/DataBadge';
import Provenance from '../components/Provenance';
import { reserveStressTest } from '../lib/calculations';
import { reserveContext } from '../data/reserveData';
import './Reserve.css';

export default function Reserve() {
  const [days, setDays] = useState(74);
  const [consumption, setConsumption] = useState(5.0);
  const [disruption, setDisruption] = useState(20);

  const result = useMemo(
    () => reserveStressTest({ currentReserveDays: days, dailyConsumption: consumption, importDisruptionPct: disruption }),
    [days, consumption, disruption]
  );

  return (
    <div className="reserve">
      <header className="case-study__header">
        <p className="hero__eyebrow">Strategic Reserve Stress Test</p>
        <h1>Enter your own numbers</h1>
        <p className="case-study__sub">
          This calculator never assumes India's actual reserve position — it only computes from what you enter
          below. The formula is fully shown so the result can be checked by hand.
        </p>
      </header>

      <div className="reserve__layout">
        <Panel eyebrow="Inputs" title="Your assumptions" right={<DataBadge type="SIMULATION" />}>
          <NumberField label="Current reserve coverage" unit="days" value={days} onChange={setDays} min={0} max={200} />
          <NumberField label="Daily consumption" unit="million bbl/day" value={consumption} onChange={setConsumption} min={0.1} max={10} step={0.1} />
          <NumberField label="Import disruption" unit="%" value={disruption} onChange={setDisruption} min={0} max={100} />
          <Provenance source={reserveContext.source} />
          <p className="case-study__hint">{reserveContext.note}</p>
        </Panel>

        <Panel eyebrow="Output" title="Implied coverage" right={result && <span className={`band-pill band-pill--${statusClass(result.status)}`}>{result.status}</span>}>
          {result ? (
            <>
              <p className="reserve__big">{result.impliedCoverageDays}<span> days</span></p>
              <div className="assumptions">
                <p className="assumptions__title">Calculated — assumptions:</p>
                <ul>{result.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
              <p className="case-study__formula mono">
                effective daily draw = consumption × (1 + disruption%) · implied coverage = (reserve days × consumption) / effective daily draw
              </p>
            </>
          ) : (
            <p className="case-study__hint">Enter reserve days and daily consumption to see a result.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function statusClass(status) {
  return { SAFE: 'low', WATCH: 'moderate', 'HIGH RISK': 'high', CRITICAL: 'critical' }[status] || 'low';
}

function NumberField({ label, unit, value, onChange, min, max, step = 1 }) {
  return (
    <label className="sim-slider">
      <span className="sim-slider__top">
        <span>{label}</span>
        <span className="mono sim-slider__value">{value} {unit}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </label>
  );
}
