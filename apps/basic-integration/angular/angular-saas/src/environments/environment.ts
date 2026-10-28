import { env } from './.env';
import { posthogEnvironment } from './posthog.generated';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  buildYear: 2024,
  posthogProjectToken: posthogEnvironment.projectToken,
  posthogHost: posthogEnvironment.host,
};
