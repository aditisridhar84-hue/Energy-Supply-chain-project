import DataBadge from '../DataBadge';
import { DATA_SOURCE_CATEGORIES, DEMO_MODE_NOTE } from '../../config/demoConfig';
import './DataMethodology.css';

const STATUS_TO_BADGE = {
  REAL: 'REAL',
  'REAL (manual)': 'REAL',
  'REAL (partial)': 'REAL',
  DEMO: 'DEMO',
};

export default function DataMethodology() {
  return (
    <div className="methodology">
      <p className="methodology__note">{DEMO_MODE_NOTE}</p>
      <div className="methodology__table">
        <div className="methodology__row methodology__row--head">
          <span>Category</span>
          <span>Production source</span>
          <span>This prototype</span>
        </div>
        {DATA_SOURCE_CATEGORIES.map((c) => (
          <div key={c.category} className="methodology__row">
            <span className="methodology__category">{c.category}</span>
            <span className="methodology__source">{c.productionSource}</span>
            <span className="methodology__status">
              <DataBadge type={STATUS_TO_BADGE[c.prototypeStatus] || 'DEMO'} />
              <span className="methodology__status-note">{c.note}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
