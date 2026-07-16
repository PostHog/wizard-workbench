<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import posthog from 'posthog-js'
import { searchShows } from '../composables/useTMDB'
import type { Media } from '../types'
import MediaCard from '../components/media/MediaCard.vue'

const route = useRoute()
const query = ref('')
const results = ref<Media[]>([])
const loading = ref(false)

const search = async () => {
  if (!query.value.trim()) {
    results.value = []
    return
  }

  loading.value = true
  try {
    const response = await searchShows(query.value, 1)
    results.value = response.results.filter((item: Media) => 
      item.media_type === 'movie' || item.media_type === 'tv'
    ) as Media[]
    posthog.capture('search_submitted', {
      result_count: results.value.length,
      has_results: results.value.length > 0,
    })
  } catch (error) {
    console.error('Search error:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    query.value = String(newQuery)
    search()
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen p-10 bg-black text-white">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Search</h1>
      
      <form @submit.prevent="search" class="mb-8">
        <div class="flex gap-4">
          <input
            v-model="query"
            type="text"
            placeholder="Search for movies or TV shows..."
            class="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            class="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg transition"
            :disabled="loading"
          >
            <span v-if="loading">Searching...</span>
            <span v-else>Search</span>
          </button>
        </div>
      </form>

      <div v-if="loading" class="text-center py-10">
        <div class="text-white">Searching...</div>
      </div>

      <div v-else-if="results.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <MediaCard
          v-for="item in results"
          :key="item.id"
          :item="item"
          :type="(item.media_type || 'movie') as any"
          class="w-full"
        />
      </div>

      <div v-else-if="query && !loading" class="text-center py-10 text-gray-400">
        No results found
      </div>
    </div>
  </div>
</template>
