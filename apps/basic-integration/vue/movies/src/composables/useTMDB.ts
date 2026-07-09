import posthog from 'posthog-js'
import type { Credits, Media, MediaType, PageResult, Person } from '../types'
import { LRUCache } from 'lru-cache'
import { hash as ohash } from 'ohash'

const apiBaseUrl = 'https://movies-proxy.vercel.app'

const promiseCache = new LRUCache<string, any>({
  max: 500,
  ttl: 2000 * 60 * 60, // 2 hours
})

const stateCache = new Map<string, any>()

async function _fetchTMDB(url: string, params: Record<string, string | number | boolean | undefined> = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  const fullUrl = `${apiBaseUrl}/tmdb/${url}${queryString ? `?${queryString}` : ''}`
  
  const response = await fetch(fullUrl)
  if (!response.ok) {
    const error = new Error(`TMDB API error: ${response.statusText}`)
    posthog.capture('tmdb_request_failed', {
      endpoint: url,
      status_code: response.status,
    })
    posthog.captureException(error, {
      endpoint: url,
      status_code: response.status,
    })
    throw error
  }
  return response.json()
}

export function fetchTMDB(url: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<any> {
  const hash = ohash([url, params])
  
  // Check state cache first
  if (stateCache.has(hash)) {
    return Promise.resolve(stateCache.get(hash))
  }
  
  // Check promise cache
  if (!promiseCache.has(hash)) {
    const promise = _fetchTMDB(url, params)
      .then((res) => {
        stateCache.set(hash, res)
        return res
      })
      .catch((e) => {
        promiseCache.delete(hash)
        throw e
      })
    promiseCache.set(hash, promise)
  }
  
  return promiseCache.get(hash)!
}

const blocked = new Set([
  '66046', '65143', '120057', '137215', '127008', '135272', '152511', '154887',
  '1123136', '209609', '153496', '214997', '203552', '735902', '561996',
  '198004', '206239', '210107', '234282', '203164', '219651', '599333',
  '919207', '606906', '231268', '119773', '223890', '229955',
])

export async function listMedia(type: MediaType, query: string, page: number): Promise<PageResult<Media>> {
  const r = await fetchTMDB(`${type}/${query}`, { page }) as PageResult<Media>
  r.results = r.results.filter((m: Media) => !blocked.has(m.id.toString()))
  return r
}

export async function getMedia(type: MediaType, id: string): Promise<Media> {
  if (blocked.has(id.toString())) {
    throw new Error('This media is under copyright restriction and cannot be viewed.')
  }
  return fetchTMDB(`${type}/${id}`, {
    append_to_response: 'videos,credits,images,external_ids,release_dates,combined_credits',
    include_image_language: 'en',
  })
}

export async function getRecommendations(type: MediaType, id: string, page = 1): Promise<PageResult<Media>> {
  const r = await fetchTMDB(`${type}/${id}/recommendations`, { page }) as PageResult<Media>
  r.results = r.results.filter((m: Media) => !blocked.has(m.id.toString()))
  return r
}

export function getTvShowEpisodes(id: string, season: string) {
  return fetchTMDB(`tv/${id}/season/${season}`)
}

export function getTrending(media: string, page = 1) {
  return fetchTMDB(`trending/${media}/week`, { page })
}

export async function getMediaByGenre(media: string, genre: string, page = 1): Promise<PageResult<Media>> {
  const r = await fetchTMDB(`discover/${media}`, {
    with_genres: genre,
    page,
  }) as PageResult<Media>
  r.results = r.results.filter(m => !blocked.has(m.id.toString()))
  return r
}

export function getCredits(id: string | number, type: string): Promise<Credits> {
  return fetchTMDB(`person/${id}/${type}`)
}

export function getGenreList(media: string): Promise<{ name: string, id: number }[]> {
  return fetchTMDB(`genre/${media}/list`).then(res => res.genres)
}

export function getPerson(id: string): Promise<Person> {
  return fetchTMDB(`person/${id}`, {
    append_to_response: 'images,combined_credits,external_ids',
    include_image_language: 'en',
  })
}

export async function searchShows(query: string, page = 1) {
  const r = await fetchTMDB('search/multi', { query, page, include_adult: false })
  r.results = r.results.filter((m: Media) => !blocked.has(m.id.toString()))
  return r
}
