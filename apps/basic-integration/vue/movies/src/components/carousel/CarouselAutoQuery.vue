<script setup lang="ts">
import { ref, onMounted } from 'vue'
import posthog from 'posthog-js'
import type { QueryItem } from '../../types'
import { listMedia } from '../../composables/useTMDB'
import MediaCard from '../media/MediaCard.vue'
import CarouselBase from './CarouselBase.vue'

const props = defineProps<{
  query: QueryItem
}>()

const items = ref<any[]>([])
const loading = ref(true)
const isPostHogConfigured = Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST,
)

function exploreCollection() {
  if (isPostHogConfigured) {
    posthog.capture('collection_explored', {
      media_type: props.query.type,
      collection: props.query.query,
    })
  }
}

onMounted(async () => {
  try {
    const result = await listMedia(props.query.type, props.query.query, 1)
    items.value = result.results || []
  } catch (error) {
    console.error('Error loading media:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <CarouselBase>
    <template #title>
      {{ query.title }}
    </template>
    <template #more>
      <router-link :to="`/${query.type}/category/${query.query}`" class="n-link" @click="exploreCollection">
        Explore more
      </router-link>
    </template>
    <MediaCard
      v-for="item of items"
      :key="item.id"
      :item="item"
      :query="query"
      :type="query.type"
      class="flex-1 w-40 md:w-60"
    />
  </CarouselBase>
</template>
