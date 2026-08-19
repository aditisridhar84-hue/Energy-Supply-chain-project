import { supplierMix } from '../data/supplierData';
import './SupplierMixChart.css';

const SEGMENT_COLOR = {
  'Middle East (Hormuz-transiting)': '#D06246',
  'Middle East / OPEC': '#D06246',
  'Russia / CIS': '#E8A33D',
  'Other (Americas, Africa, etc.)': '#35ADA6',
};

function MixColumn({ data }) {
  return (
    <div className="supplier-col">
      <p className="supplier-col__label">{data.label}</p>
      <div className="supplier-col__stack">
        {data.segments.map((s) => (
          <div
            key={s.name}
            className="supplier-col__seg"
            style={{ height: `${s.pct}%`, background: SEGMENT_COLOR[s.name] }}
            title={`${s.name}: ${s.pct}%`}
          >
            <span>{s.pct}%</span>
          </div>
        ))}
      </div>
      <ul className="supplier-col__legend">
        {data.segments.map((s) => (
          <li key={s.name}>
            <span className="dot" style={{ background: SEGMENT_COLOR[s.name] }} />
            {s.name} — {s.pct}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SupplierMixChart() {
  return (
    <div className="supplier-mix">
      <MixColumn data={supplierMix.preCrisis} />
      <MixColumn data={supplierMix.duringCrisis} />
    </div>
  );
}
