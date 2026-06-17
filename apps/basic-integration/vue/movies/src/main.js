import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import posthog from './posthog'

const app = createApp(App)

app.config.errorHandler = (err) => {
  posthog.captureException(err)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
