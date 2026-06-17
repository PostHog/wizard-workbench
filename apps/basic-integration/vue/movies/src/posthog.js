import posthog from 'posthog-js'

const posthogPublicKey = import.meta.env.VITE_POSTHOG_PUBLIC_KEY
const posthogHost = import.meta.env.VITE_POSTHOG_HOST

if (posthogPublicKey && posthogHost) {
  posthog.init(posthogPublicKey, {
    api_host: posthogHost,
  })
}

export default posthog
