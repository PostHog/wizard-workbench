import { createFileRoute } from '@tanstack/react-router'
import type { User } from '~/utils/users'
import { getPostHogClient } from '~/utils/posthog-server'

export const Route = createFileRoute('/api/users/$userId')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        console.info(`Fetching users by id=${params.userId}... @`, request.url)
        try {
          const res = await fetch(
            'https://jsonplaceholder.typicode.com/users/' + params.userId,
          )
          if (!res.ok) {
            throw new Error('Failed to fetch user')
          }

          const user = (await res.json()) as User

          getPostHogClient().capture({
            distinctId: `team-member-${user.id}`,
            event: 'api_user_viewed',
            properties: {
              user_id: user.id,
              source: 'api',
            },
          })

          return Response.json({
            id: user.id,
            name: user.name,
            email: user.email,
          })
        } catch (e) {
          console.error(e)
          getPostHogClient().captureException(e, 'anonymous', {
            source: 'api',
            operation: 'fetch_user',
            requested_user_id: params.userId,
          })
          return Response.json({ error: 'User not found' }, { status: 404 })
        }
      },
    },
  },
})
