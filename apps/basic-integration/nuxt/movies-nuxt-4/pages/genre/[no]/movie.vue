<script setup lang="ts">
import type { Media, MediaType } from '~/types'

const route = useRoute()
const no = computed(() => route.params.no as string)
const type = 'movie' as MediaType

const items: Media[] = reactive([])

const list = await getGenreList(type)
const name = list.find(item => item.id === +no.value)?.name
const posthog = usePostHog()

if (import.meta.client) {
  posthog?.capture('genre_browsed', {
    genre_id: no.value,
    genre_name: name,
    media_type: type,
  })
}

async function fetch(page: number) {
  const data = await getMediaByGenre(type, no.value, page)
  items.push(...data.results)
}
</script>

<template>
  <MediaAutoLoadGrid
    :fetch="fetch"
    :type="type"
    :items="items"
  >
    {{ type === 'tv' ? 'TV' : 'Movie' }} Genre: {{ name }}
  </MediaAutoLoadGrid>
</template>
