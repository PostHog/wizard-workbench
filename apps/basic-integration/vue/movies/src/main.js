import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import posthog from 'posthog-js'

const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_POSTHOG_HOST

if (posthogToken && posthogHost) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
  })
} else if (import.meta.env.DEV) {
  const missingVariable = !posthogToken
    ? 'VITE_POSTHOG_PROJECT_TOKEN'
    : 'VITE_POSTHOG_HOST'
  console.error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  )
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

if (posthogToken && posthogHost) {
  app.config.errorHandler = (error) => {
    posthog.captureException(error)
  }
}

app.mount('#app')
