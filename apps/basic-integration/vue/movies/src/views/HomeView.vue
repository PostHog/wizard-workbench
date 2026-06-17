<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { MediaType } from '../types'
import { QUERY_LIST } from '../constants/lists'
import { listMedia, getMedia } from '../composables/useTMDB'
import MediaHero from '../components/media/MediaHero.vue'
import CarouselAutoQuery from '../components/carousel/CarouselAutoQuery.vue'
import posthog from 'posthog-js'

const type = ref<MediaType>('movie')
const heroItem = ref<any>({
  id: '123',
  title: 'Welcome to Vue Movies',
  overview: 'Browse movies and TV shows. This is fake data that renders immediately.',
  backdrop_path: '/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg',
  vote_average: 8.5,
  vote_count: 1000,
  release_date: '2024-01-01',
  runtime: 120,
})

onMounted(async () => {
  try {
    const queries = [QUERY_LIST.movie[0], QUERY_LIST.tv[0]]
    const list = await listMedia(type.value, queries[0].query, 1)
    if (list.results.length > 0) {
      const item = await getMedia(type.value, list.results[0].id)
      heroItem.value = item
    }
  } catch (error) {
    console.error('Error loading hero item:', error)
  }
})

function handleHeroClick() {
  posthog.capture('media_hero_clicked', {
    media_id: heroItem.value?.id,
    media_title: heroItem.value?.title || heroItem.value?.name,
    media_type: type.value,
  })
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <div v-if="heroItem" class="mb-10">
      <router-link :to="`/${type}/${heroItem.id}`" @click="handleHeroClick">
        <MediaHero :item="heroItem" />
      </router-link>
    </div>
    <CarouselAutoQuery
      v-for="query of [QUERY_LIST.movie[0], QUERY_LIST.tv[0]]"
      :key="query.type + query.query"
      :query="query"
    />
  </div>
</template>
