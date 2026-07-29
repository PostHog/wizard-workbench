import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import posthog from './lib/posthog'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (error) => {
  if (import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST) {
    posthog.captureException(error)
  }
}

app.mount('#app')
