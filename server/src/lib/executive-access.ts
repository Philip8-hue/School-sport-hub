export const executiveSports = ['football', 'basketball', 'volleyball'] as const;
export const executiveCategories = {
  football: ['Male Football', 'Female Football'],
  basketball: ['Male Basketball', 'Female Basketball'],
  volleyball: ['Volleyball']
};
export const isExecutiveSport = (value: unknown): value is keyof typeof executiveCategories => typeof value === 'string' && Object.hasOwn(executiveCategories, value);
