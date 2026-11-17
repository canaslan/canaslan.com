export const workIntro = 'I’m a Product Designer and Design Strategist, helping teams build impactful products and make the most of constraints.';
export const workSummary = 'Over the past decade, I’ve brought together design, product management, and strategic thinking to turn complex challenges into useful products. I’m currently working on digital assessment solutions at Cambridge University Press & Assessment.';
export const experience = [
  { organization: 'Cambridge University Press & Assessment', role: 'User/Customer Experience Designer', dates: 'Aug 2021 - Present', location: 'Cambridge, UK', active: true, padding: 64, detailGap: 8, details: [
    'I led the design of the MVP release of Cambridge OCR’s insight platform to help school leaders make sense of exam results.',
    'For nearly five years, I led the UX design work alongside a major technology overhaul, closely collaborating with many stakeholders and enabling the best possible design under heavy constraints.',
  ] },
  { organization: 'OBSS', role: 'Senior Product Designer', dates: 'Nov 2020 - Aug 2021', location: 'Istanbul, Turkiye', padding: 8, details: ['Led the product design for the MVP release of an internal talent management platform.'] },
  { organization: 'Kolay IK', role: 'Product Manager', dates: 'Jan 2019 - Nov 2020', location: 'Istanbul, Turkiye', padding: 16, detailGap: 16, details: [
    'As both product manager and product designer, led the entire product definition and design work for the first release of a complex product that is integrated into a rich HR ecosystem.',
    'Dramatically improved the usability and competitiveness of the product by converting a file export improvement brief into a design overhaul.',
  ] },
  { organization: 'Kolay IK', role: 'UX Designer', dates: 'Apr 2018 - Jan 2019', location: 'Istanbul, Turkiye', padding: 16, connectedToPrevious: true, details: ['As the first UX Designer, laid the foundations of the design system and UX-centric workflows which quickly increased customer satisfaction.'] },
  { organization: 'SHERPA Experience Design Studio', role: 'UX Strategist', dates: 'Nov 2016 - Feb 2018', location: 'Istanbul, Turkiye', padding: 16, details: ['Conducted UX audits, created UX strategy reports, and service blueprints for customers from various industries.'] },
  { organization: 'NTT Communications', role: 'Service Designer', dates: 'Jul 2013 - Sep 2013', location: 'Tokyo, Japan', padding: 4 },
  { organization: 'University of Southern Denmark', role: 'Master of Science in Product Design', dates: 'Sep 2012 - Sep 2014', location: 'Sønderborg, Denmark', padding: 24 },
];
export const academicRows = [
  { label: 'DEGREE', value: 'Master of Science, MSc' },
  { label: 'PROGRAM', value: 'IT Product Design' },
  { label: 'UNIVERSITY', value: 'University of Southern Denmark' },
  { label: 'LOCATION', value: 'Sønderborg, Denmark' },
];
export const workMarkdown = [
  '# Work — Can Aslan', workIntro, workSummary,
  '## 12 years in design and product development',
  'In four countries, combining theory and practice, across all parts of product development.',
  ...experience.map(item => [`### ${item.role}`, item.organization, `${item.dates} · ${item.location}`, ...(item.details ?? [])].join('\n\n')),
  '## Academic grounding', ...academicRows.map(row => `- ${row.label}: ${row.value}`),
].join('\n\n') + '\n';
