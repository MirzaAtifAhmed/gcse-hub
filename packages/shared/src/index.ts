export const APP_NAME = 'GCSE Hub';
export const APP_TAGLINE = 'Your GCSE Journey Starts Here';

export const DEFAULT_SUBJECTS = [
  {
    name: 'Mathematics',
    slug: 'mathematics',
    description: 'Number, algebra, ratio, geometry, probability and GCSE problem solving.',
    availableYears: [7, 8, 9, 10, 11],
  },
  {
    name: 'English',
    slug: 'english',
    description: 'Language, literature, writing, comprehension and GCSE exam technique.',
    availableYears: [7, 8, 9, 10, 11],
  },
  {
    name: 'Science',
    slug: 'science',
    description: 'Biology, chemistry and physics foundations through GCSE.',
    availableYears: [7, 8, 9, 10, 11],
  },
] as const;
