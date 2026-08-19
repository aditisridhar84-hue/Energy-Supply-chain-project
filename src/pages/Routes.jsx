import Panel from '../components/Panel';
import DataBadge from '../components/DataBadge';
import './Routes.css';

const STAGES = [
  {
    title: 'Supplier',
    nodes: [
      { name: 'Iraq / Saudi Arabia / UAE / Kuwait / Qatar', risk: 'high', tag: 'Hormuz-transiting' },
      { name: 'Russia (Far East / Baltic)', risk: 'low', tag: 'Non-Hormuz' },
      { name: 'United States / Latin America', risk: 'low', tag: 'Non-Hormuz' },
    ],
  },
  {
    title: 'Shipping route',
    nodes: [
      { name: 'Strait of Hormuz corridor', risk: 'high', tag: 'Disrupted' },
      { name: 'Cape of Good Hope (long-haul reroute)', risk: 'medium', tag: 'Conceptual alternative' },
      { name: 'Trans-Pacific / Trans-Atlantic routes', risk: 'low', tag: 'Unaffected' },
    ],
  },
  {
    title: 'Port',
    nodes: [
      { name: 'West coast ports (Vadinar, Sikka, JNPT)', risk: 'medium', tag: 'Primary discharge' },
      { name: 'East coast ports (Paradip, Vizag)', risk: 'low', tag: 'Secondary discharge' },
    ],
  },
  {
    title: 'Refinery',
    nodes: [
      { name: 'Jamnagar (Reliance) — sour-grade heavy', risk: 'medium', tag: 'Configured for Gulf grades' },
      { name: 'Public-sector refineries — mixed grade', risk: 'low', tag: 'More grade-flexible' },
    ],
  },
  {
    title: 'Domestic distribution',
    nodes: [
      { name: 'Pipeline & rail network to demand centers', risk: 'low', tag: 'Not directly exposed to Hormuz' },
    ],
  },
];

export default function Routes() {
  return (
    <div className="routes">
      <header className="case-study__header">
        <p className="hero__eyebrow">Route resilience</p>
        <h1>Supplier → route → port → refinery → distribution</h1>
        <p className="case-study__sub">
          A simplified network view. Nodes and legs actually reported as disrupted are marked from real
          reporting; alternative pathways where exact shipping-route data isn't publicly available are
          explicitly labeled <strong>conceptual</strong> rather than invented as fact.
        </p>
      </header>

      <Panel eyebrow="Network" title="Simplified supply chain" right={<DataBadge type="REAL" />}>
        <div className="network">
          {STAGES.map((stage, i) => (
            <div key={stage.title} className="network__stage">
              <p className="network__stage-title">{stage.title}</p>
              <div className="network__nodes">
                {stage.nodes.map((n) => (
                  <div key={n.name} className={`node node--${n.risk}`}>
                    <p className="node__name">{n.name}</p>
                    <span className="node__tag">{n.tag}</span>
                  </div>
                ))}
              </div>
              {i < STAGES.length - 1 && <div className="network__arrow" aria-hidden="true">→</div>}
            </div>
          ))}
        </div>
        <div className="network__legend">
          <span><i className="dot dot--high" /> High risk / disrupted (reported)</span>
          <span><i className="dot dot--medium" /> Elevated / conceptual alternative</span>
          <span><i className="dot dot--low" /> Low risk / unaffected</span>
        </div>
      </Panel>

      <Panel eyebrow="Recommendation" title="Rerouting logic" right={<DataBadge type="AI_INSIGHT" />}>
        <p className="case-study__hint">
          With the Strait of Hormuz corridor flagged high-risk, the network favors legs already reported as
          having absorbed real volume during the crisis — Russian and Latin American supply routes that don't
          transit Hormuz (see Supplier Diversification in the case study, which is real reported data). The
          Cape of Good Hope long-haul reroute is included as a conceptual fallback for Gulf-origin cargo that
          still needs to move without Hormuz transit; no public dataset confirms specific vessel-level rerouting
          volumes, so it is labeled conceptual rather than sourced.
        </p>
      </Panel>
    </div>
  );
}
