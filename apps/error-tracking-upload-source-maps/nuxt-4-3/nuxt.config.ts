export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  runtimeConfig: {
    public: {
      posthogKey: process.env.NUXT_PUBLIC_POSTHOG_KEY ?? "phc_placeholder",
      posthogHost:
        process.env.NUXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    },
  },
});
