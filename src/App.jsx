import { useState } from 'react';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import CaseStudy from './pages/CaseStudy';
import './App.css';

const PAGES = {
  dashboard: Dashboard,
  'case-study': CaseStudy,
};

export default function App() {
  const [active, setActive] = useState('dashboard');
  const Page = PAGES[active] || Dashboard;

  return (
    <div className="app">
      <NavBar active={active} onChange={setActive} />
      <main className="app__main">
        <Page onNavigate={setActive} />
      </main>
      <footer className="app__footer">
        <p>
          Decision-support prototype. Every figure is tagged Live/Observed, Modelled, AI Insight, or Demo Data —
          see each panel for full source provenance and the Data &amp; Methodology section on the dashboard.
        </p>
      </footer>
    </div>
  );
}
