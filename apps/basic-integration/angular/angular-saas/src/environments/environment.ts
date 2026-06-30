import { env } from './.env';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  buildYear: 2024,
  posthogKey: env['POSTHOG_PROJECT_TOKEN'] || '',
  posthogHost: env['POSTHOG_HOST'] || 'https://us.posthog.com',
};
