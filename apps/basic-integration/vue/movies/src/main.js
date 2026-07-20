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

if (!posthogProjectToken || !posthogHost) {
  throw new Error('PostHog environment variables are required')
}

posthog.init(posthogProjectToken, {
  api_host: posthogHost,
  defaults: '2026-01-30',
})

app.use(createPinia())
app.use(router)

app.config.errorHandler = (error) => {
  posthog.captureException(error)
}

app.mount('#app')
