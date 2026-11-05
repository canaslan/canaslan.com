export const researchInterests = [
  'Futures',
  'Design Fiction',
  'Calm Computing',
  'Worldbuilding',
] as const;

export const education = {
  heading: '/EDUCATION',
  rows: [
    { label: 'DEGREE', value: 'Master of Science, MSc' },
    { label: 'PROGRAM', value: 'IT Product Design' },
    { label: 'UNIVERSITY', value: 'University of Southern Denmark' },
  ],
} as const;

export type ResearchPaper = {
  title: string;
  subtitle?: string;
  href: string;
};

export const pastResearch: ResearchPaper[] = [
  {
    title:
      'Ringu: A comparison of the original novel and the film adaptation (Undergraduate thesis) (Japanese)',
    subtitle: '『リング』―原作と映画版について―',
    href: '#',
  },
  {
    title: 'Distributed cognition and collaborative task performance in confined environments',
    href: '#',
  },
  {
    title: 'Design Fiction with video (MSc thesis)',
    href: '#',
  },
];
