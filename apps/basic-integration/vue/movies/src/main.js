import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './lib/posthog'
import posthog from 'posthog-js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (error, instance, info) => {
  posthog.captureException(error)
}

app.mount('#app')
