export const workIntro = 'I’m a Product Designer and Design Strategist, helping teams build impactful products and make the most of constraints.';
export const workSummary = 'Over the past decade, I’ve brought together design, product management, and strategic thinking to turn complex challenges into useful products. I’m currently working on digital assessment solutions at Cambridge University Press & Assessment.';
export const experience = [
  { organization: 'Cambridge University Press & Assessment', role: 'UX Designer', dates: 'Aug 2021 - Present', location: 'Cambridge, UK', color: '700', height: 329, projects: [
    { title: 'Advanced results analysis platform for Cambridge OCR', description: 'I led the design of the MVP release of Cambridge OCR’s insight platform to help school leaders make sense of exam results.' },
    { title: 'Redesigning the Cambridge Insight platform', description: 'For nearly five years, I led the UX design work alongside a major technology overhaul, closely collaborating with many stakeholders and enabling the best possible design under heavy constraints.' },
  ] },
  { organization: 'OBSS', role: 'Senior Product Designer', dates: 'Nov 2020 - Aug 2021', location: 'Istanbul, Turkiye', color: '600', height: 105 },
  { organization: 'Kolay IK', role: 'Product Manager', dates: 'Jan 2019 - Nov 2020', location: 'Istanbul, Turkiye', color: '500', height: 329, projects: [
    { title: '0-to-1 design of a compensation management product', description: 'As a both product manager and product designer, led the entire product definition and design work for the first release of a complex product that is integrated into a rich HR ecosystem.' },
    { title: 'Design overhaul for workforce scheduling product', description: 'Dramatically improved the usability and competitiveness of the product by converting a file export improvement brief into a design overhaul.' },
  ] },
  { organization: 'Kolay IK', role: 'UX Designer', dates: 'Apr 2018 - Jan 2019', location: 'Istanbul, Turkiye', color: '400', height: 108 },
  { organization: 'SHERPA Experience Design Studio', role: 'UX Strategist', dates: 'Nov 2016 - Feb 2018', location: 'Istanbul, Turkiye', color: '300', height: 147 },
  { organization: 'NTT Communications', role: 'Service Designer', dates: 'Jul 2013 - Sep 2013', location: 'Tokyo, Japan', color: '200', height: 110 },
  { organization: 'University of Southern Denmark', role: 'MSc in Product Design', dates: 'Sep 2012 - Sep 2014', location: 'Sønderborg, Denmark', color: '100', height: 119 },
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
  ...experience.map(item => [`### ${item.organization}${item.context ? ` (${item.context})` : ''}`, item.role, `${item.dates} · ${item.location}`, ...(item.projects ?? []).map(project => `#### ${project.title}\n\n${project.description}`)].join('\n\n')),
  '## Academic grounding', ...academicRows.map(row => `- ${row.label}: ${row.value}`),
].join('\n\n') + '\n';
