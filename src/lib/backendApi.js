const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(`Backend request failed: ${response.status}`);
  return response.json();
}

export function getBackendHealth() {
  return request('/api/health');
}

export function simulateScenarioApi(scenario, severityPct) {
  return request('/api/scenarios/simulate', {
    method: 'POST',
    body: JSON.stringify({ scenario, severity_pct: severityPct }),
  });
}

export function getRecommendationsApi(hormuzDisruptionPct) {
  return request(`/api/recommendations?hormuz_disruption_pct=${encodeURIComponent(hormuzDisruptionPct)}`);
}
