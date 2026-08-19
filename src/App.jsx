import { useState } from 'react';
import NavBar from './components/NavBar';
import Overview from './pages/Overview';
import CaseStudy from './pages/CaseStudy';
import RiskEngine from './pages/RiskEngine';
import Simulator from './pages/Simulator';
import RoutesPage from './pages/Routes';
import Reserve from './pages/Reserve';
import './App.css';

const PAGES = {
  overview: Overview,
  'case-study': CaseStudy,
  'risk-engine': RiskEngine,
  simulator: Simulator,
  routes: RoutesPage,
  reserve: Reserve,
};

export default function App() {
  const [active, setActive] = useState('overview');
  const Page = PAGES[active] || Overview;

  return (
    <div className="app">
      <NavBar active={active} onChange={setActive} />
      <main className="app__main">
        <Page onNavigate={setActive} />
      </main>
      <footer className="app__footer">
        <p>
          Built as a resilience-intelligence prototype. Every figure is tagged REAL / CALCULATED / SIMULATION /
          AI INSIGHT / FORECAST — see each panel for full source provenance.
        </p>
      </footer>
    </div>
  );
}
