import { env } from './.env';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  buildYear: 2024,
  posthogKey: import.meta.env['NG_APP_POSTHOG_PROJECT_TOKEN'] as string || '',
  posthogHost: import.meta.env['NG_APP_POSTHOG_HOST'] as string || 'https://us.i.posthog.com',
};
