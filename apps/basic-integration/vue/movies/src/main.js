import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import posthog from 'posthog-js'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_POSTHOG_HOST
const isPostHogConfigured = Boolean(projectToken && host)

if (!isPostHogConfigured) {
  if (import.meta.env.DEV) {
    const missingVariable = !projectToken
      ? 'VITE_POSTHOG_PROJECT_TOKEN'
      : 'VITE_POSTHOG_HOST'
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    )
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    defaults: '2026-01-30',
  })
}

app.use(createPinia())
app.use(router)

app.config.errorHandler = (error) => {
  if (isPostHogConfigured) {
    posthog.captureException(error)
  }
}

app.mount('#app')
