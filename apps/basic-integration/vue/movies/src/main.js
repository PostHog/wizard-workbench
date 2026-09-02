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
  const missingVariable = !posthogProjectToken
    ? 'VITE_POSTHOG_PROJECT_TOKEN'
    : 'VITE_POSTHOG_HOST'

  if (import.meta.env.DEV) {
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    )
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  })

  app.config.errorHandler = (error) => {
    posthog.captureException(error)
  }
}

app.use(createPinia())
app.use(router)

app.mount('#app')
