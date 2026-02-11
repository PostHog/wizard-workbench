import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import posthog from 'posthog-js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Initialize PostHog
posthog.init(import.meta.env.VITE_POSTHOG_KEY || '', {
  api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
  defaults: '2025-05-24',
})

app.use(createPinia())
app.use(router)

// Global error handler for PostHog exception tracking
app.config.errorHandler = (err, instance, info) => {
  posthog.captureException(err)
}

app.mount('#app')
