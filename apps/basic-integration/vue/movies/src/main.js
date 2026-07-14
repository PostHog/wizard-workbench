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
  defaults: '2026-05-30',
})

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err, instance, info) => {
  posthog.captureException(err, {
    component: instance?.$options?.name,
    vue_error_info: info,
  })
}

app.mount('#app')
