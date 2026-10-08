import { defineNitroConfig } from 'nitropack'

export default defineNitroConfig({
  routeRules: {
    '/**': { cors: true },
    '/tmdb/**': { swr: 3600 },
  },
  runtimeConfig: {
    tmdb: {
      apiKey: process.env.TMDB_API_KEY || '',
    },
    posthog: {
      publicKey: process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
      host: process.env.NUXT_PUBLIC_POSTHOG_HOST,
    },
  },
})
