import { useState } from 'react';
import Panel from '../components/Panel';
import DataBadge from '../components/DataBadge';
import Provenance from '../components/Provenance';
import PriceTimelineChart from '../components/PriceTimelineChart';
import SupplierMixChart from '../components/SupplierMixChart';
import { indianCrudeBasketMonthly, febBaselineUsdPerBbl, hormuzTimeline, timelineSourceNote } from '../data/priceData';
import { supplierMix } from '../data/supplierData';
import { pctChangeFromBaseline, estimateImportCost } from '../lib/calculations';
import './CaseStudy.css';

export default function CaseStudy() {
  const [volume, setVolume] = useState(4.5); // million bbl/day, sourced default (see below)
  const march = indianCrudeBasketMonthly.find((m) => m.month === 'Mar 2026');
  const cost = estimateImportCost({ volumeMillionBblPerDay: volume, priceUsdPerBbl: march.priceUsdPerBbl, days: 30 });
  const costBaseline = estimateImportCost({ volumeMillionBblPerDay: volume, priceUsdPerBbl: febBaselineUsdPerBbl, days: 30 });

  return (
    <div className="case-study">
      <header className="case-study__header">
        <p className="hero__eyebrow">Dedicated case study</p>
        <h1>2026 Hormuz Crisis — India Impact</h1>
        <p className="case-study__sub">
          Geopolitical event → supply-chain disruption → crude price shock → India's import cost →
          alternative suppliers → refinery &amp; logistics risk → response.
        </p>
      </header>

      <Panel eyebrow="Event timeline" title="What actually happened, in order" right={<DataBadge type="REAL" />}>
        <ol className="event-timeline">
          {hormuzTimeline.map((e) => (
            <li key={e.date}>
              <span className="event-timeline__date">{e.date}</span>
              <span className="event-timeline__label">{e.label}</span>
              <span className="event-timeline__phase">{e.phase}</span>
            </li>
          ))}
        </ol>
        <Provenance source={timelineSourceNote} />
      </Panel>

      <Panel eyebrow="Price shock" title="Indian crude basket, month by month" right={<DataBadge type="REAL" />}>
        <PriceTimelineChart height={280} />
        <div className="price-table">
          {indianCrudeBasketMonthly.map((m) => {
            const change = m.priceUsdPerBbl != null ? pctChangeFromBaseline(m.priceUsdPerBbl, febBaselineUsdPerBbl) : null;
            return (
              <div key={m.month} className="price-table__row">
                <span className="price-table__month">{m.month}</span>
                <span className="price-table__price">{m.priceUsdPerBbl != null ? `$${m.priceUsdPerBbl.toFixed(1)}` : '—'}</span>
                <span className={`price-table__change ${change > 0 ? 'is-up' : ''}`}>
                  {change != null ? (
                    <>
                      {change > 0 ? '+' : ''}{change.toFixed(0)}% <DataBadge type="CALCULATED" />
                    </>
                  ) : (
                    <span className="price-table__pending">pending verification</span>
                  )}
                </span>
                <span className="price-table__note">{m.note}</span>
              </div>
            );
          })}
        </div>
        <p className="case-study__formula mono">
          % change from baseline = ((currentPrice − FebruaryPrice) / FebruaryPrice) × 100 — calculated from PPAC-sourced data, not an official PPAC statistic.
        </p>
      </Panel>

      <Panel eyebrow="Import cost impact" title="Estimated exposure vs. official baseline" right={<DataBadge type="CALCULATED" />}>
        <label className="field">
          <span>Assumed import volume (million barrels/day)</span>
          <input
            type="range"
            min="2"
            max="6"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
          <span className="field__value mono">{volume.toFixed(1)} million bbl/day</span>
        </label>
        <p className="case-study__hint">
          Default (4.5 million bbl/day) reflects India's reported total crude imports in March 2026 — see supplier
          section below. Adjust the slider to test other assumptions.
        </p>
        <div className="cost-compare">
          <div>
            <p className="cost-compare__label">Feb 2026 baseline (30 days)</p>
            <p className="cost-compare__value">${costBaseline.totalUsdBillion.toFixed(2)}B</p>
          </div>
          <div>
            <p className="cost-compare__label">Mar 2026 shock (30 days)</p>
            <p className="cost-compare__value cost-compare__value--amber">${cost.totalUsdBillion.toFixed(2)}B</p>
          </div>
          <div>
            <p className="cost-compare__label">Calculated exposure</p>
            <p className="cost-compare__value cost-compare__value--red">+${(cost.totalUsdBillion - costBaseline.totalUsdBillion).toFixed(2)}B</p>
          </div>
        </div>
        <div className="assumptions">
          <p className="assumptions__title">Calculated exposure — assumptions:</p>
          <ul>{cost.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
        <p className="case-study__hint">
          This is a <strong>calculated exposure</strong>, not an official import-bill figure. The Government of
          India's own reported figures (Ministry of Finance, Lok Sabha) are used directly wherever available —
          see the price table above.
        </p>
      </Panel>

      <Panel eyebrow="Supplier diversification" title="Where India's crude came from, before vs. during" right={<DataBadge type="REAL" />}>
        <SupplierMixChart />
        <div className="supplier-notes">
          <Provenance source={supplierMix.preCrisis.source} />
          <p className="case-study__hint">{supplierMix.preCrisis.caveat}</p>
          <Provenance source={supplierMix.duringCrisis.source} />
          <p className="case-study__hint">{supplierMix.duringCrisis.caveat}</p>
        </div>
      </Panel>
    </div>
  );
}
