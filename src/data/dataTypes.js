// Central definition of the five data categories the whole app must distinguish.
// Every number shown in the UI carries one of these tags plus a <Provenance> record.
// Never mix categories in a single displayed value.

export const DATA_TYPES = {
  REAL: {
    key: 'REAL',
    label: 'Live / Observed',
    description: 'Retrieved from a named official/primary source — a real, dated reading, not a live stream.',
    color: '#2FA6A0',
  },
  CALCULATED: {
    key: 'CALCULATED',
    label: 'Modelled',
    description: 'A transparent formula applied to observed data.',
    color: '#E8A33D',
  },
  SIMULATION: {
    key: 'SIMULATION',
    label: 'Modelled Scenario',
    description: 'User-selected hypothetical scenario — not a live forecast.',
    color: '#C1502E',
  },
  AI_INSIGHT: {
    key: 'AI_INSIGHT',
    label: 'AI Insight',
    description: 'Rule-based interpretation of observed/modelled information. Not a source of new facts.',
    color: '#7C8AA0',
  },
  FORECAST: {
    key: 'FORECAST',
    label: 'Model Forecast',
    description: 'A third-party or model-generated prediction, cited to its source.',
    color: '#8E6BAF',
  },
  DEMO: {
    key: 'DEMO',
    label: 'Demo Data',
    description: 'Illustrative placeholder for this 5-day prototype, structured so a live feed can replace it later.',
    color: '#6B7A99',
  },
};
