import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import posthog from 'posthog-js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const posthogProjectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_POSTHOG_HOST

if (posthogProjectToken && posthogHost) {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
  })
} else if (import.meta.env.DEV) {
  const missingVariable = posthogProjectToken
    ? 'VITE_POSTHOG_HOST'
    : 'VITE_POSTHOG_PROJECT_TOKEN'
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  )
}

app.use(createPinia())
app.use(router)

app.config.errorHandler = (error) => {
  if (posthogProjectToken && posthogHost) {
    posthog.captureException(error)
  }
}

app.mount('#app')
