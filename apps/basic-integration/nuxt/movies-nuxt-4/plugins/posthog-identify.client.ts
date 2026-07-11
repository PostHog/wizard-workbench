export default defineNuxtPlugin(() => {
  const posthog = usePostHog()
  const cookie = useCookie<string | null>('auth-user')

  if (cookie.value) {
    posthog?.identify(cookie.value, {
      username: cookie.value,
    })
  }
})
