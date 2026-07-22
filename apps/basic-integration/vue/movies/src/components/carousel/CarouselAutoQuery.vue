<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { QueryItem } from '../../types'
import { listMedia } from '../../composables/useTMDB'
import MediaCard from '../media/MediaCard.vue'
import CarouselBase from './CarouselBase.vue'
import posthog from '../../lib/posthog'

const props = defineProps<{
  query: QueryItem
}>()

const items = ref<any[]>([])
const loading = ref(true)

function exploreCategory() {
  posthog.capture('category_explored', {
    media_type: props.query.type,
    category: props.query.query,
  })
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
      <router-link :to="`/${query.type}/category/${query.query}`" class="n-link" @click="exploreCategory">
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
