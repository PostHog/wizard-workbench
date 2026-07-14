import { browser } from "$app/environment"
import posthog from "posthog-js"

export function identifyUser(user: {
  id: string
  email?: string | null
  full_name?: string | null
  company_name?: string | null
}) {
  if (!browser) {
    return
  }

  posthog.identify(user.id, {
    email: user.email ?? undefined,
    name: user.full_name ?? undefined,
    company_name: user.company_name ?? undefined,
  })
}

export function resetUser() {
  if (!browser) {
    return
  }

  posthog.reset()
}
