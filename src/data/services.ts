export const services = [
  { slug: 'product-ux-audit', title: 'Product UX Audit', tagline: 'Understand where your product is difficult to use and what to improve first.', audience: 'For teams with an existing product and a specific journey that feels confusing, difficult, or underperforming.' },
  { slug: 'product-direction-sprint', title: 'Product Direction Sprint', tagline: 'Agree on the next move before committing to delivery.', audience: 'For anyone facing competing priorities, an unclear opportunity, or uncertainty about a proposed feature.' },
  { slug: 'second-opinion', title: 'Second Opinion', tagline: 'Get an expert second opinion before taking your design further.', audience: 'For anyone working on a product, interface, or prototype who wants constructive feedback on a specific question.' },
];
// All three detail frames currently share this copy in Figma.
export const detailAudience = services[2].audience;
export const detailOutcome = 'I look at what you are trying to achieve, how the design supports it, and where it could be clearer or more effective. I explain the reasoning behind my feedback and distinguish professional judgement from questions that need further evidence.';
export const sessions = [
  { title: 'Quick second opinion', minutes: 15, rows: [
    { label: 'Type', value: 'Video call. Your platform of choice.' },
    { label: 'Duration', value: '15 min.' },
    { label: 'What to bring to the call', value: 'Bring one design question and a screen or small interaction to discuss' },
    { label: 'What you’ll get', value: 'You’ll leave with an initial perspective and a suggested next step.' },
    { label: 'Price', value: 'FREE!' },
  ] },
  { title: 'In-depth second opinion', minutes: 60, rows: [
    { label: 'Type', value: 'Video call. Your platform of choice.' },
    { label: 'Duration', value: '60 min.' },
    { label: 'What to share before the call', value: 'An agreed flow, prototype, or design decision so I can review in advance.' },
    { label: 'What happens in the call', value: 'We discuss what is working, what deserves attention, and the trade-offs behind possible changes.' },
    { label: 'What you’ll get', value: 'A concise recap of the recommended priorities and questions worth investigating.' },
    { label: 'Price', value: 'FREE!' },
  ] },
];
