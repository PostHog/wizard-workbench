import posthog from 'posthog-js'

export const auth: Auth = {
  status: 'loggedOut',
  username: undefined,
  login: (username: string) => {
    auth.status = 'loggedIn'
    auth.username = username

    posthog.identify(username, {
      username,
    })
    posthog.capture('user_logged_in', {
      authentication_method: 'demo_username',
    })
  },
  logout: () => {
    posthog.capture('user_logged_out', {
      previous_status: auth.status,
    })
    posthog.reset()

    auth.status = 'loggedOut'
    auth.username = undefined
  },
}

export type Auth = {
  login: (username: string) => void
  logout: () => void
  status: 'loggedOut' | 'loggedIn'
  username?: string
}
