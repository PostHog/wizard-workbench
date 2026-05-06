import { env } from './.env';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  buildYear: 2024,
  posthogKey: env['NG_APP_POSTHOG_PROJECT_TOKEN'] || '<ph_project_token>',
  posthogHost: env['NG_APP_POSTHOG_HOST'] || 'https://us.posthog.com',
};
