import { env } from './.env';

export const environment = {
  production: true,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'de-DE',
  supportedLanguages: ['de-DE', 'en-US', 'es-ES', 'fr-FR', 'it-IT'],
  buildYear: 2024,
  posthogKey: env['NG_APP_POSTHOG_PROJECT_TOKEN'] || '',
  posthogHost: env['NG_APP_POSTHOG_HOST'] || 'https://us.i.posthog.com',
};
