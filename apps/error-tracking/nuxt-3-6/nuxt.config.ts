export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      posthogKey: process.env.NUXT_PUBLIC_POSTHOG_KEY ?? "phc_placeholder",
      posthogHost:
        process.env.NUXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    },
  },
});
