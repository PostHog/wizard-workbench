export const APP_NAME = 'cicd-monorepo-pnpm-node-react'

export type AnalyticsSource = 'backend' | 'frontend'

/**
 * Builds a namespaced event name shared across the workspace so that backend
 * and frontend events line up under the same convention in PostHog. Lives in
 * the shared package so both apps bundle the same source — handy for checking
 * that source maps cover workspace dependencies, not just app-local code.
 */
export function eventName(source: AnalyticsSource, name: string): string {
  return `${APP_NAME}:${source}:${name}`
}
