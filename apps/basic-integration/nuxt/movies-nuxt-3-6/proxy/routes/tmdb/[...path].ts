import { $fetch } from 'ofetch'
import { getQuery } from 'ufo'
import { emitPostHogLog } from '../../utils/posthog-log-exporter'

const TMDB_API_URL = 'https://api.themoviedb.org/3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event.node.req.url!)
  // eslint-disable-next-line no-console
  console.log(
    'Fetching TMDB API',
    {
      url: event.node.req.url,
      query,
      params: event.context.params,
    },
  )
  const config = useRuntimeConfig()
  if (!config.tmdb.apiKey)
    throw new Error('TMDB API key is not set')
  try {
    const response = await $fetch(event.context.params!.path, {
      baseURL: TMDB_API_URL,
      params: {
        api_key: config.tmdb.apiKey,
        language: 'en-US',
        ...query,
      },
    })
    await emitPostHogLog(config, 'INFO', 'tmdb proxy request completed', {
      outcome: 'succeeded',
    })
    return response
  }
  catch (e: any) {
    const status = e?.response?.status || 500
    event.node.res.statusCode = status
    await emitPostHogLog(config, 'ERROR', 'tmdb proxy request completed', {
      outcome: 'failed',
      upstream_status: status,
    })
    return e.message?.replace(config.tmdb.apiKey, '***')
  }
})
