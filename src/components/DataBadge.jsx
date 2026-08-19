import { DATA_TYPES } from '../data/dataTypes';
import './DataBadge.css';

export default function DataBadge({ type = 'REAL' }) {
  const t = DATA_TYPES[type] || DATA_TYPES.REAL;
  return (
    <span className="data-badge" style={{ '--badge-color': t.color }} title={t.description}>
      <span className="data-badge__dot" />
      {t.label}
    </span>
  );
}
