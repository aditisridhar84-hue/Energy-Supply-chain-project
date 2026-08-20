import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import DataBadge from '../DataBadge';
import { SCENARIOS, SCENARIO_ORDER } from '../../data/scenarioData';
import { computeScenario, refineryRiskColor } from '../../lib/scenarioEngine';
import { febBaselineUsdPerBbl } from '../../data/priceData';
import './ScenarioSimulator.css';

export default function ScenarioSimulator({ onScenarioChange }) {
  const [scenarioKey, setScenarioKey] = useState('HORMUZ');
  const [severity, setSeverity] = useState(70);

  const result = useMemo(() => computeScenario(scenarioKey, severity), [scenarioKey, severity]);

  useEffect(() => {
    onScenarioChange?.(result);
  }, [result, onScenarioChange]);

  const chartData = [
    { metric: 'Crude price ($/bbl)', Before: febBaselineUsdPerBbl, After: result.priceUsdPerBbl },
    { metric: 'Supply gap (%)', Before: 0, After: result.supplyGapPct },
  ];

  return (
    <div className="scenario-sim">
      <div className="scenario-sim__controls">
        <label className="field-inline">
          <span>Scenario</span>
          <select value={scenarioKey} onChange={(e) => setScenarioKey(e.target.value)}>
            {SCENARIO_ORDER.map((k) => (
              <option key={k} value={k}>{SCENARIOS[k].label}</option>
            ))}
          </select>
        </label>
        <label className="field-inline field-inline--grow">
          <span>Severity <span className="mono">{severity}%</span></span>
          <input type="range" min="0" max="100" value={severity} onChange={(e) => setSeverity(parseInt(e.target.value, 10))} />
        </label>
      </div>

      <p className="scenario-sim__flag">
        <DataBadge type="SIMULATION" /> MODELLED SCENARIO — NOT A LIVE FORECAST
      </p>
      <p className="scenario-sim__scenario-note">{SCENARIOS[scenarioKey].note}</p>

      <div className="scenario-sim__metrics">
        <Metric label="Supply gap" value={`${result.supplyGapPct}%`} />
        <Metric label="Crude price impact" value={`${result.priceImpactPct > 0 ? '+' : ''}${result.priceImpactPct}%`} sub={`$${result.priceUsdPerBbl}/bbl`} />
        <Metric label="Import cost impact" value={`${result.importCostImpactUsdBillion >= 0 ? '+' : ''}$${result.importCostImpactUsdBillion}B`} sub="per 30 days, illustrative volume" />
        <Metric label="Refinery supply risk" value={result.refineryRisk} color={refineryRiskColor(result.refineryRisk)} />
      </div>

      <div className="scenario-sim__chart">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#1C2842" vertical={false} />
            <XAxis dataKey="metric" tick={{ fill: '#8A93AC', fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={{ stroke: '#263353' }} tickLine={false} />
            <YAxis tick={{ fill: '#8A93AC', fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#17233D', border: '1px solid #263353', borderRadius: 8, fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
            <Bar dataKey="Before" fill="#8A93AC" radius={[4, 4, 0, 0]} />
            <Bar dataKey="After" fill="#E8A33D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Metric({ label, value, sub, color }) {
  return (
    <div className="scenario-metric">
      <p className="scenario-metric__label">{label}</p>
      <p className="scenario-metric__value" style={color ? { color } : undefined}>{value}</p>
      {sub && <p className="scenario-metric__sub">{sub}</p>}
    </div>
  );
}
