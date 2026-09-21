import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import posthog from 'posthog-js'

import App from './App.vue'
import router from './router'

const posthogProjectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_POSTHOG_HOST

if (!posthogProjectToken) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured',
    )
  }
} else if (!posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured',
    )
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
  })
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

if (posthogProjectToken && posthogHost) {
  app.config.errorHandler = (error) => {
    posthog.captureException(error)
  }
}

app.mount('#app')
