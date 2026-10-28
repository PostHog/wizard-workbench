import { env } from './.env';
import { posthogEnvironment } from './posthog.generated';

export const environment = {
  production: true,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'de-DE',
  supportedLanguages: ['de-DE', 'en-US', 'es-ES', 'fr-FR', 'it-IT'],
  buildYear: 2024,
  posthogProjectToken: posthogEnvironment.projectToken,
  posthogHost: posthogEnvironment.host,
};
