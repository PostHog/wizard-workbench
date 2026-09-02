export const APP_NAME = 'cicd-monorepo-pnpm-node-react'

export type AnalyticsSource = 'backend' | 'frontend'

/**
 * Builds a namespaced event name shared across the workspace so that backend
 * and frontend events line up under the same convention in PostHog. Lives in
 * the shared package so both apps share the same event-naming logic.
 */
export function eventName(source: AnalyticsSource, name: string): string {
  return `${APP_NAME}:${source}:${name}`
}
