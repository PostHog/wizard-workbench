import { PostHog } from 'posthog-node'

const TMDB_API_URL = 'https://api.themoviedb.org/3'

export default defineEventHandler(async (event) => {
  const host = process.env.NUXT_PUBLIC_POSTHOG_HOST
  const publicKey = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const posthog = host && publicKey ? new PostHog(publicKey, { host, enableExceptionAutocapture: true }) : null
  const query = getQuery(event)
  // eslint-disable-next-line no-console
  console.log(
    'Fetching TMDB API',
    {
      url: getRequestURL(event).href,
      query,
      params: event.context.params,
    },
  )
  const config = useRuntimeConfig()
  if (!config.tmdb.apiKey)
    throw new Error('TMDB API key is not set')
  try {
    return await $fetch(event.context.params!.path, {
      baseURL: TMDB_API_URL,
      params: {
        api_key: config.tmdb.apiKey,
        language: 'en-US',
        ...query,
      },
      headers: {
        Accept: 'application/json',
      },
    })
  }
  catch (e: any) {
    const status = e?.response?.status || 500
    setResponseStatus(event, status)
    await posthog?.capture({
      distinctId: getHeader(event, 'x-posthog-distinct-id') || 'tmdb_proxy',
      event: 'tmdb_proxy_failed',
      properties: {
        proxy_path: event.context.params?.path || 'unknown',
        status_code: status,
        query_keys: Object.keys(query),
        has_session_header: Boolean(getHeader(event, 'x-posthog-session-id')),
      },
    })
    await posthog?.captureException(e)
    return {
      error: String(e)?.replace(config.tmdb.apiKey, '***'),
    }
  }
})
