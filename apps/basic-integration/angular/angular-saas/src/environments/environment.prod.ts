import { env } from './.env';

export const environment = {
  production: true,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'de-DE',
  supportedLanguages: ['de-DE', 'en-US', 'es-ES', 'fr-FR', 'it-IT'],
  buildYear: 2024,
  posthog_token: env['posthog_token'] ?? '',
  posthog_host: env['posthog_host'] ?? '',
};
