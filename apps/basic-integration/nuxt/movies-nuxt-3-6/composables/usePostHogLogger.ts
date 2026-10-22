export function usePostHogLogger() {
  const { $posthog } = useNuxtApp()

  return $posthog?.logger
}
