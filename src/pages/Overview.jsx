import Panel from '../components/Panel';
import DataBadge from '../components/DataBadge';
import PriceTimelineChart from '../components/PriceTimelineChart';
import { brentSnapshot, indianCrudeBasketMonthly, febBaselineUsdPerBbl } from '../data/priceData';
import { pctChangeFromBaseline } from '../lib/calculations';
import { computeRiskScore } from '../lib/riskEngine';
import './Overview.css';

export default function Overview({ onNavigate }) {
  const latest = [...indianCrudeBasketMonthly].reverse().find((m) => m.priceUsdPerBbl != null);
  const pctChange = pctChangeFromBaseline(latest.priceUsdPerBbl, febBaselineUsdPerBbl);

  const illustrativeRisk = computeRiskScore({
    priceChangePct: pctChange,
    hormuzDisruptionPct: 55,
    topSupplierSharePct: 50,
    shippingDisruptionPct: 45,
    altSupplyAvailabilityPct: 55,
  });

  return (
    <div className="overview">
      <section className="hero">
        <p className="hero__eyebrow">Case study · India · 2026</p>
        <h1 className="hero__title">
          From a strike on the Strait<br />to a barrel at the refinery gate.
        </h1>
        <p className="hero__thesis">
          Using real petroleum and geopolitical data, this system traces India's exposure to Strait of
          Hormuz disruption — from the crude price shock, through import costs and supplier concentration,
          to simulated procurement and routing responses.
        </p>
        <div className="hero__cta">
          <button className="btn btn--primary" onClick={() => onNavigate('case-study')}>Open the case study</button>
          <button className="btn btn--ghost" onClick={() => onNavigate('simulator')}>Run a what-if scenario</button>
        </div>
      </section>

      <section className="bridge">
        <div className="bridge__stat">
          <p className="bridge__label">Brent crude <DataBadge type="REAL" /></p>
          <p className="bridge__value">${brentSnapshot.priceUsdPerBbl.toFixed(2)}<span>/bbl</span></p>
          <p className="bridge__meta">as of {brentSnapshot.asOf}</p>
        </div>
        <div className="bridge__stat">
          <p className="bridge__label">Indian crude basket <DataBadge type="REAL" /></p>
          <p className="bridge__value">${latest.priceUsdPerBbl.toFixed(1)}<span>/bbl</span></p>
          <p className="bridge__meta">{latest.month} · {latest.source?.type === 'Tracking site, sourced from PPAC daily release' ? 'daily spot' : 'monthly avg'}</p>
        </div>
        <div className="bridge__stat">
          <p className="bridge__label">Vs. Feb baseline <DataBadge type="CALCULATED" /></p>
          <p className="bridge__value bridge__value--amber">+{pctChange.toFixed(0)}<span>%</span></p>
          <p className="bridge__meta">calculated from PPAC-sourced data</p>
        </div>
        <div className="bridge__stat">
          <p className="bridge__label">Illustrative risk score <DataBadge type="AI_INSIGHT" /></p>
          <p className={`bridge__value bridge__value--${illustrativeRisk.band.toLowerCase()}`}>{illustrativeRisk.band}</p>
          <p className="bridge__meta">score {illustrativeRisk.score}/100 · see Risk Engine</p>
        </div>
      </section>

      <Panel
        eyebrow="Signature chart"
        title="Indian crude basket — 2026"
        right={<DataBadge type="REAL" />}
      >
        <PriceTimelineChart />
        <p className="overview__note">
          Line breaks where a monthly average could not be independently verified (May–Jun 2026) — see the
          case study for the full provenance of every point.
        </p>
      </Panel>

      <section className="overview__grid">
        <Panel eyebrow="01" title="2026 Hormuz Crisis — India Impact" className="overview__card">
          <p>The full timeline: pre-conflict baseline through renewed August uncertainty, with sourced data at every stage.</p>
          <button className="btn btn--ghost" onClick={() => onNavigate('case-study')}>View case study →</button>
        </Panel>
        <Panel eyebrow="02" title="Geopolitical Supply Risk Score" className="overview__card">
          <p>A transparent, weighted formula — not an LLM judgment — scoring exposure from LOW to CRITICAL.</p>
          <button className="btn btn--ghost" onClick={() => onNavigate('risk-engine')}>View risk engine →</button>
        </Panel>
        <Panel eyebrow="03" title='"What If?" Simulator' className="overview__card">
          <p>Move the sliders on Hormuz disruption, price, and supply availability to see projected impact.</p>
          <button className="btn btn--ghost" onClick={() => onNavigate('simulator')}>Run simulator →</button>
        </Panel>
        <Panel eyebrow="04" title="Route Resilience" className="overview__card">
          <p>Supplier → shipping route → port → refinery → distribution, with disrupted legs flagged.</p>
          <button className="btn btn--ghost" onClick={() => onNavigate('routes')}>View routes →</button>
        </Panel>
        <Panel eyebrow="05" title="Strategic Reserve Stress Test" className="overview__card">
          <p>Enter your own reserve coverage and disruption assumptions to see implied days of cover.</p>
          <button className="btn btn--ghost" onClick={() => onNavigate('reserve')}>Run stress test →</button>
        </Panel>
        <Panel eyebrow="Note" title="Data provenance" className="overview__card overview__card--note">
          <p>Every figure in this app is tagged REAL, CALCULATED, SIMULATION, AI INSIGHT, or FORECAST, and every REAL figure carries a source, dataset, period, and unit. Nothing here is invented.</p>
        </Panel>
      </section>
    </div>
  );
}
