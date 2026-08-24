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
    capture_exceptions: {
      capture_console_errors: false,
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
    },
  })
} else if (import.meta.env.DEV) {
  const missingVariable = projectToken
    ? 'VITE_POSTHOG_HOST'
    : 'VITE_POSTHOG_PROJECT_TOKEN'

  console.error(new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  ))
}

const app = createApp(App)

app.config.errorHandler = (error) => {
  if (projectToken && host) {
    posthog.captureException(error)
  }
}

app.use(createPinia())
app.use(router)

app.mount('#app')
