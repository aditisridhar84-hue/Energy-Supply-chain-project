import { useState, useCallback, useRef } from 'react';
import Panel from '../components/Panel';
import DataBadge from '../components/DataBadge';
import KPICard from '../components/dashboard/KPICard';
import RiskMap from '../components/dashboard/RiskMap';
import ScenarioSimulator from '../components/dashboard/ScenarioSimulator';
import ProcurementOrchestrator from '../components/dashboard/ProcurementOrchestrator';
import ResilienceScorePanel from '../components/dashboard/ResilienceScore';
import DataMethodology from '../components/dashboard/DataMethodology';
import { brentSnapshot, indianCrudeBasketMonthly, febBaselineUsdPerBbl } from '../data/priceData';
import { pctChangeFromBaseline } from '../lib/calculations';
import { computeRiskScore } from '../lib/riskEngine';
import { computeScenario } from '../lib/scenarioEngine';
import { DEMO_MODE } from '../config/demoConfig';
import './Dashboard.css';

// "Current assessed conditions" — an explicit, separate assumption from the interactive
// What-If simulator below. Calibrated to a moderate-elevated Hormuz disruption reflecting
// the still-unresolved situation as of the latest real price reading (see case study).
const CURRENT_ASSUMED_HORMUZ_DISRUPTION_PCT = 55;

export default function Dashboard() {
  const [scenarioResult, setScenarioResult] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const riskMapRef = useRef(null);

  const handleScenarioChange = useCallback((result) => setScenarioResult(result), []);

  const handleViewRoutes = useCallback((supplierId) => {
    setFocusId(supplierId);
    riskMapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const latest = [...indianCrudeBasketMonthly].reverse().find((m) => m.priceUsdPerBbl != null);
  const pctChange = pctChangeFromBaseline(latest.priceUsdPerBbl, febBaselineUsdPerBbl);

  const currentRisk = computeRiskScore({
    priceChangePct: pctChange,
    hormuzDisruptionPct: CURRENT_ASSUMED_HORMUZ_DISRUPTION_PCT,
    topSupplierSharePct: 50,
    shippingDisruptionPct: 45,
    altSupplyAvailabilityPct: 55,
  });

  const currentScenario = computeScenario('HORMUZ', CURRENT_ASSUMED_HORMUZ_DISRUPTION_PCT);

  let hormuzBand = 'LOW';
  if (CURRENT_ASSUMED_HORMUZ_DISRUPTION_PCT >= 60) hormuzBand = 'HIGH';
  else if (CURRENT_ASSUMED_HORMUZ_DISRUPTION_PCT >= 30) hormuzBand = 'MEDIUM';

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="dashboard__title">INDIA ENERGY RESILIENCE</p>
          <p className="dashboard__subtitle">AI-powered geopolitical risk and procurement decision support</p>
        </div>
        {DEMO_MODE && <span className="dashboard__demo-badge">DEMO MODE</span>}
      </header>

      <section className="dashboard__kpis">
        <KPICard
          label="Hormuz Disruption Risk"
          value={hormuzBand}
          riskLevel={hormuzBand}
          dataType="AI_INSIGHT"
          meta={`assumed ${CURRENT_ASSUMED_HORMUZ_DISRUPTION_PCT}% disruption`}
        />
        <KPICard
          label="India Crude Supply Risk"
          value={currentRisk.band}
          riskLevel={currentRisk.band}
          dataType="AI_INSIGHT"
          meta={`score ${currentRisk.score}/100`}
        />
        <KPICard
          label="Brent Crude Price"
          value={`$${brentSnapshot.priceUsdPerBbl.toFixed(2)}`}
          unit="/bbl"
          dataType="REAL"
          meta={`as of ${brentSnapshot.asOf}`}
        />
        <KPICard
          label="Supply Gap"
          value={`${currentScenario.supplyGapPct}%`}
          dataType="CALCULATED"
          meta="modelled from current disruption assumption"
        />
        <KPICard
          label="Last Updated"
          value={latest.month}
          dataType="REAL"
          meta="Indian Basket, latest verified reading"
        />
      </section>

      <p className="dashboard__flow">
        LIVE RISK <span>→</span> ECONOMIC IMPACT <span>→</span> AI RECOMMENDATION
      </p>

      <Panel eyebrow="Geopolitical & Supply Risk" title="Supply Risk Map" right={<DataBadge type="REAL" />}>
        <div ref={riskMapRef}>
          <RiskMap focusId={focusId} />
        </div>
      </Panel>

      <Panel eyebrow="Scenario modelling" title="What-If Disruption Simulator">
        <ScenarioSimulator onScenarioChange={handleScenarioChange} />
      </Panel>

      <Panel eyebrow="Adaptive procurement" title="AI Procurement Recommendation">
        <ProcurementOrchestrator scenarioResult={scenarioResult} onViewRoutes={handleViewRoutes} />
      </Panel>

      <Panel eyebrow="Composite indicator" title="India Energy Resilience Score">
        <ResilienceScorePanel scenarioResult={scenarioResult} />
      </Panel>

      <Panel eyebrow="Transparency" title="Data & Methodology">
        <DataMethodology />
      </Panel>
    </div>
  );
}
