import { env } from './.env';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  buildYear: 2024,
  posthogKey: env['posthog_key'] || '',
  posthogHost: env['posthog_host'] || 'https://us.i.posthog.com',
};
