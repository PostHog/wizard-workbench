import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import posthog from 'posthog-js'

import App from './App.vue'
import router from './router'
import { initPostHog } from './posthog'

const app = createApp(App)

initPostHog()

app.config.errorHandler = (error) => {
  posthog.captureException(error)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
