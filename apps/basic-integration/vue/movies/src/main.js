import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import posthog from 'posthog-js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

posthog.init(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN || '', {
  api_host: import.meta.env.VITE_POSTHOG_HOST || '',
  defaults: '2026-01-30',
  capture_pageview: 'history_change',
})

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err, instance, info) => {
  posthog.captureException(err, {
    component_name: instance?.$options?.name,
    error_info: info,
  })
}

app.mount('#app')
