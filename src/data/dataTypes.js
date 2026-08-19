// Central definition of the five data categories the whole app must distinguish.
// Every number shown in the UI carries one of these tags plus a <Provenance> record.
// Never mix categories in a single displayed value.

export const DATA_TYPES = {
  REAL: {
    key: 'REAL',
    label: 'Official data',
    description: 'Retrieved from a named official/primary source.',
    color: '#2FA6A0',
  },
  CALCULATED: {
    key: 'CALCULATED',
    label: 'Calculated',
    description: 'A transparent formula applied to official data.',
    color: '#E8A33D',
  },
  SIMULATION: {
    key: 'SIMULATION',
    label: 'Scenario simulation',
    description: 'User-defined hypothetical input — not an official forecast.',
    color: '#C1502E',
  },
  AI_INSIGHT: {
    key: 'AI_INSIGHT',
    label: 'AI insight',
    description: 'Interpretation of real/calculated information. Not a source of new facts.',
    color: '#7C8AA0',
  },
  FORECAST: {
    key: 'FORECAST',
    label: 'Model forecast',
    description: 'A third-party or model-generated prediction, cited to its source.',
    color: '#8E6BAF',
  },
};
