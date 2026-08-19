// Context only — NOT injected as fact into the reserve calculator.
// The Strategic Reserve module always uses user-entered numbers; this exists so the
// UI can show "for reference" context without ever claiming it is India's actual SPR.

export const reserveContext = {
  note: "One industry estimate puts India's strategic petroleum reserve at roughly a 74-day buffer under normal consumption — this is a third-party estimate, not an official disclosure, and the calculator below never assumes it.",
  source: {
    name: 'Discovery Alert (industry analysis)',
    dataset: "India's strategic petroleum reserve coverage, contextual estimate",
    period: '2026',
    unit: 'days of cover',
    url: 'https://discoveryalert.com.au/india-russian-oil-imports-middle-east-crisis-hormuz-2026/',
    type: 'Third-party estimate, not an official Government of India figure',
  },
};
