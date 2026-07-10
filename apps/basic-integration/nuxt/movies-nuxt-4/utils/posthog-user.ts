export async function hashUserId(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase()
  const data = new TextEncoder().encode(normalized)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const bytes = Array.from(new Uint8Array(digest))
  const hash = bytes.map(byte => byte.toString(16).padStart(2, '0')).join('')
  return `user_${hash.slice(0, 24)}`
}
