import { createServerFn } from '@tanstack/react-start'
import { getPostHogClient } from '~/utils/posthog-server'

export type User = {
  id: number
  name: string
  email: string
}

export const fetchUsers = createServerFn().handler(async () => {
  console.info('Fetching users...')
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  const data = (await res.json()) as Array<User>
  const users = data.slice(0, 10).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
  }))

  getPostHogClient().capture({
    distinctId: 'anonymous',
    event: 'team_directory_loaded',
    properties: {
      member_count: users.length,
      source: 'server_fn',
    },
  })

  return users
})

export const fetchUser = createServerFn({ method: 'POST' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: userId }) => {
    console.info(`Fetching user with id ${userId}...`)

    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      )
      if (!res.ok) {
        throw new Error('Failed to fetch user')
      }
      const user = (await res.json()) as User

      return {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    } catch (error) {
      getPostHogClient().capture({
        distinctId: 'anonymous',
        event: 'team_member_load_failed',
        properties: {
          source: 'server_fn',
          requested_user_id: userId,
        },
      })
      getPostHogClient().captureException(error, 'anonymous', {
        source: 'server_fn',
        operation: 'fetch_user',
        requested_user_id: userId,
      })
      throw error
    }
  })
