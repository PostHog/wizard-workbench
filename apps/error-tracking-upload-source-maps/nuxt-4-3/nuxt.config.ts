export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  modules: ["@posthog/nuxt"],
  sourcemap: {
    client: "hidden",
  },
  nitro: {
    rollupConfig: {
      output: {
        sourcemapExcludeSources: false,
      },
    },
  },
  posthogConfig: {
    publicKey: process.env.NUXT_PUBLIC_POSTHOG_KEY ?? "",
    host: process.env.NUXT_PUBLIC_POSTHOG_HOST ?? "",
    clientConfig: {
      capture_exceptions: true,
    },
    serverConfig: {
      enableExceptionAutocapture: true,
    },
    sourcemaps: {
      enabled: true,
      projectId: process.env.POSTHOG_PROJECT_ID ?? "",
      personalApiKey: process.env.POSTHOG_API_KEY ?? "",
    },
  },
});
