import { env } from './.env';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  posthogProjectToken: env['NG_APP_POSTHOG_PROJECT_TOKEN'],
  posthogHost: env['NG_APP_POSTHOG_HOST'],
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  buildYear: 2024,
};
