import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import posthog from 'posthog-js'

const app = createApp(App)
const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_POSTHOG_HOST
const posthogConfigured = Boolean(posthogToken && posthogHost)

if (posthogConfigured) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
  })
} else if (import.meta.env.DEV) {
  const missingVariable = posthogToken ? 'VITE_POSTHOG_HOST' : 'VITE_POSTHOG_PROJECT_TOKEN'
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  )
}

app.use(createPinia())
app.use(router)

app.config.errorHandler = (error) => {
  if (posthogConfigured) {
    posthog.captureException(error)
  }
}

app.mount('#app')
