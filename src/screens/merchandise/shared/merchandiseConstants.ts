// Product information slugs that are also sent as top-level payload keys.
export const TOP_LEVEL_SLUGS = [
  'gender',
  'age-group',
  'material',
  'fabric',
  'fit-type',
  'care-instructions',
  'country-of-origin',
  'manufacturer',
  'personalization-info',
];

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
