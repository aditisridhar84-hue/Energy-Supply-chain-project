import { useState, useEffect } from 'react';
import DataBadge from '../DataBadge';
import { riskMapNodes, riskMapNote } from '../../data/riskMapData';
import './RiskMap.css';

// Hand-placed positions (% of container) — loosely geographic, not a literal GIS projection.
const POSITIONS = {
  russia: { top: '10%', left: '52%' },
  'middle-east-gulf': { top: '38%', left: '38%' },
  'saudi-arabia': { top: '58%', left: '30%' },
  uae: { top: '62%', left: '44%' },
  iraq: { top: '40%', left: '52%' },
  'united-states': { top: '18%', left: '8%' },
  'latin-america': { top: '72%', left: '10%' },
};

const RISK_LABEL = { low: 'GREEN', medium: 'YELLOW', high: 'RED' };

export default function RiskMap({ focusId, id }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = riskMapNodes.find((n) => n.id === selectedId);

  useEffect(() => {
    if (focusId) setSelectedId(focusId);
  }, [focusId]);

  return (
    <div className="risk-map" id={id}>
      <div className="risk-map__canvas">
        <div className="risk-map__india">
          <span>INDIA</span>
        </div>
        <svg className="risk-map__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          {riskMapNodes.map((n) => {
            const pos = POSITIONS[n.id];
            const x = parseFloat(pos.left);
            const y = parseFloat(pos.top);
            const color = n.riskLevel === 'high' ? '#D06246' : n.riskLevel === 'medium' ? '#E8A33D' : '#35ADA6';
            return (
              <line
                key={n.id}
                x1="70" y1="55"
                x2={x + 6} y2={y + 4}
                stroke={color}
                strokeWidth={selectedId === n.id ? 0.7 : 0.35}
                opacity={selectedId && selectedId !== n.id ? 0.25 : 0.8}
              />
            );
          })}
        </svg>
        {riskMapNodes.map((n) => (
          <button
            key={n.id}
            className={`risk-map__node risk-map__node--${n.riskLevel} ${selectedId === n.id ? 'is-selected' : ''}`}
            style={POSITIONS[n.id]}
            onClick={() => setSelectedId(n.id === selectedId ? null : n.id)}
            aria-pressed={selectedId === n.id}
          >
            {n.name}
          </button>
        ))}
      </div>

      <div className="risk-map__legend">
        <span><i className="dot dot--low" /> Lower risk</span>
        <span><i className="dot dot--medium" /> Moderate</span>
        <span><i className="dot dot--high" /> High risk</span>
        <span className="risk-map__legend-hint">Click a supplier for detail →</span>
      </div>

      {selected ? (
        <div className="risk-map__detail">
          <div className="risk-map__detail-head">
            <h4>{selected.name}</h4>
            <span className={`risk-tag risk-tag--${selected.riskLevel}`}>{RISK_LABEL[selected.riskLevel]}</span>
          </div>
          <dl className="risk-map__detail-grid">
            <div><dt>Risk score</dt><dd>{selected.disruptionProbabilityPct >= 55 ? 'High' : selected.disruptionProbabilityPct >= 30 ? 'Medium' : 'Low'}</dd></div>
            <div><dt>Disruption probability <DataBadge type={selected.disruptionType} /></dt><dd>{selected.disruptionProbabilityPct}%</dd></div>
            <div><dt>Route dependency <DataBadge type={selected.routeDependencyType} /></dt><dd>{selected.routeDependencyPct}% of crude mix</dd></div>
            <div><dt>Alternative available</dt><dd>{selected.alternativeAvailable ? 'Yes' : 'Limited'}</dd></div>
          </dl>
          <p className="risk-map__action"><strong>Recommended action:</strong> {selected.recommendedAction}</p>
        </div>
      ) : (
        <p className="risk-map__hint">Select a supplier node above to see its risk profile and recommended action.</p>
      )}

      <p className="risk-map__note">{riskMapNote}</p>
    </div>
  );
}
