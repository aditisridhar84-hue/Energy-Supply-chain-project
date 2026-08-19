import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid, Dot } from 'recharts';
import { indianCrudeBasketMonthly, febBaselineUsdPerBbl } from '../data/priceData';
import './PriceTimelineChart.css';

const PHASE_COLOR = {
  'PRE-CONFLICT': '#8A93AC',
  'CONFLICT SHOCK': '#D06246',
  'PARTIAL EASING': '#E8A33D',
  'CURRENT RISK': '#35ADA6',
};

function CustomDot(props) {
  const { cx, cy, payload } = props;
  if (payload.priceUsdPerBbl == null) return null;
  return <Dot cx={cx} cy={cy} r={4.5} fill={PHASE_COLOR[payload.phase]} stroke="#0B1220" strokeWidth={1.5} />;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="voyage-tooltip">
      <p className="voyage-tooltip__month">{d.month}</p>
      {d.priceUsdPerBbl != null ? (
        <>
          <p className="voyage-tooltip__price">${d.priceUsdPerBbl.toFixed(1)}/bbl</p>
          <p className="voyage-tooltip__note">{d.note}</p>
        </>
      ) : (
        <p className="voyage-tooltip__note voyage-tooltip__note--pending">{d.note}</p>
      )}
    </div>
  );
}

export default function PriceTimelineChart({ height = 260 }) {
  return (
    <div className="voyage-trace">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={indianCrudeBasketMonthly} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
          <CartesianGrid stroke="#1C2842" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#8A93AC', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            axisLine={{ stroke: '#263353' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8A93AC', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
            domain={[50, 135]}
            width={40}
            tickFormatter={(v) => `$${v}`}
          />
          <ReferenceLine
            y={febBaselineUsdPerBbl}
            stroke="#8A93AC"
            strokeDasharray="3 4"
            label={{ value: 'Feb baseline', position: 'insideTopLeft', fill: '#8A93AC', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="priceUsdPerBbl"
            stroke="#35ADA6"
            strokeWidth={2}
            dot={<CustomDot />}
            connectNulls={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="voyage-trace__legend">
        {Object.entries(PHASE_COLOR).map(([phase, color]) => (
          <span key={phase} className="voyage-trace__legend-item">
            <span className="voyage-trace__legend-dot" style={{ background: color }} />
            {phase}
          </span>
        ))}
      </div>
    </div>
  );
}
