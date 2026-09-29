import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import posthog from 'posthog-js'

import App from './App.vue'
import router from './router'

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_POSTHOG_HOST

if (projectToken && host) {
  posthog.init(projectToken, {
    api_host: host,
    defaults: '2026-01-30',
    logs: {
      serviceName: 'vue-movies-web',
      environment: import.meta.env.MODE,
    },
  })
} else if (import.meta.env.DEV) {
  const missingVariable = projectToken
    ? 'VITE_POSTHOG_HOST'
    : 'VITE_POSTHOG_PROJECT_TOKEN'
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  )
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

if (projectToken && host) {
  app.config.errorHandler = (error) => {
    posthog.captureException(error)
  }
}

app.mount('#app')
