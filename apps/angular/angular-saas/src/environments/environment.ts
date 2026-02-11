import { env } from './.env';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  buildYear: 2024,
  posthogKey: env['posthogKey'] || '<ph_project_api_key>',
  posthogHost: env['posthogHost'] || 'https://us.i.posthog.com',
};
