<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { MediaType } from '../types'
import { QUERY_LIST } from '../constants/lists'
import { listMedia, getMedia } from '../composables/useTMDB'
import MediaHero from '../components/media/MediaHero.vue'
import CarouselAutoQuery from '../components/carousel/CarouselAutoQuery.vue'
import posthog from 'posthog-js'

const props = defineProps<{
  type?: MediaType
}>()

const route = useRoute()
const mediaType = computed(() => {
  if (props.type) return props.type
  if (route.path.startsWith('/movie')) return 'movie'
  if (route.path.startsWith('/tv')) return 'tv'
  return 'movie'
})

const heroItem = ref<any>({
  id: '123',
  title: mediaType.value === 'movie' ? 'Popular Movies' : undefined,
  name: mediaType.value === 'tv' ? 'Popular TV Shows' : undefined,
  overview: 'Browse our collection. This is fake data that renders immediately.',
  backdrop_path: '/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg',
  vote_average: 8.5,
  vote_count: 1000,
  release_date: '2024-01-01',
  runtime: 120,
})
const queries = computed(() => QUERY_LIST[mediaType.value] || [])

onMounted(async () => {
  posthog.capture('media_browsed', {
    media_type: mediaType.value,
  })

  try {
    if (queries.value.length > 0) {
      const list = await listMedia(mediaType.value, queries.value[0].query, 1)
      if (list.results.length > 0) {
        const item = await getMedia(mediaType.value, list.results[0].id)
        heroItem.value = item
      }
    }
  } catch (error) {
    console.error('Error loading hero item:', error)
  }
})
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <div v-if="heroItem">
      <router-link :to="`/${mediaType}/${heroItem.id}`">
        <MediaHero :item="heroItem" />
      </router-link>
    </div>
    <CarouselAutoQuery
      v-for="query of queries"
      :key="query.type + query.query"
      :query="query"
    />
  </div>
</template>
