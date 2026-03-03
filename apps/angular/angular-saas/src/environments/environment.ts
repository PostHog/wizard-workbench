import { env } from './.env';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  buildYear: 2024,
  posthogKey: import.meta.env['NG_APP_POSTHOG_KEY'] || '<ph_project_api_key>',
  posthogHost: import.meta.env['NG_APP_POSTHOG_HOST'] || 'https://us.i.posthog.com',
};
