import DataBadge from '../DataBadge';
import './KPICard.css';

const RISK_COLOR = { LOW: 'low', MEDIUM: 'moderate', MODERATE: 'moderate', HIGH: 'high', CRITICAL: 'critical' };

export default function KPICard({ label, value, unit, riskLevel, dataType = 'REAL', meta }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card__top">
        <span className="kpi-card__label">{label}</span>
        <DataBadge type={dataType} />
      </div>
      <p className="kpi-card__value">
        {value}<span>{unit}</span>
      </p>
      {riskLevel && (
        <span className={`kpi-card__risk kpi-card__risk--${RISK_COLOR[riskLevel] || 'low'}`}>
          {riskLevel}
        </span>
      )}
      {meta && <p className="kpi-card__meta">{meta}</p>}
    </div>
  );
}
