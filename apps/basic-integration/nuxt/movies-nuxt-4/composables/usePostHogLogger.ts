export function usePostHogLogger() {
  return useNuxtApp().$posthog?.logger
}
