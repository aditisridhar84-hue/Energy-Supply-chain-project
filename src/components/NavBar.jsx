import './NavBar.css';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'case-study', label: '2026 Hormuz Crisis' },
  { id: 'risk-engine', label: 'Risk Engine' },
  { id: 'simulator', label: 'What If?' },
  { id: 'routes', label: 'Routes' },
  { id: 'reserve', label: 'Reserve' },
];

export default function NavBar({ active, onChange }) {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <span className="navbar__mark" aria-hidden="true">⌁</span>
          <div>
            <p className="navbar__name">Fairway</p>
            <p className="navbar__sub">India petroleum supply-chain resilience</p>
          </div>
        </div>
        <nav className="navbar__tabs" aria-label="Main">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`navbar__tab ${active === t.id ? 'is-active' : ''}`}
              onClick={() => onChange(t.id)}
              aria-current={active === t.id ? 'page' : undefined}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
