import posthog from 'posthog-js'

const PERSON_ID_NAMESPACE = 'auth-user:'

async function sha256(value: string) {
  const data = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function getPostHogDistinctId(username: string) {
  return `${PERSON_ID_NAMESPACE}${await sha256(username.trim().toLowerCase())}`
}

export async function identifyAuthenticatedUser(username: string) {
  const distinctId = await getPostHogDistinctId(username)
  posthog.identify(distinctId)
  return distinctId
}
