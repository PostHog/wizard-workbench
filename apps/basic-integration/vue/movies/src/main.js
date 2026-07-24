import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import posthog from 'posthog-js'

import App from './App.vue'
import router from './router'

const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_POSTHOG_HOST

if (!token && import.meta.env.DEV) {
  console.error(
    'VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured'
  )
}

if (token) {
  posthog.init(token, {
    api_host: host || 'https://us.i.posthog.com',
    defaults: '2026-01-30',
  })
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err) => {
  posthog.captureException(err)
}

app.mount('#app')
