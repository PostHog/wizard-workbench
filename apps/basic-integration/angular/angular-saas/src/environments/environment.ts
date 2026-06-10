import { env } from './.env';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  buildYear: 2024,
  posthog_token: env['posthog_token'] ?? '',
  posthog_host: env['posthog_host'] ?? '',
};
