<script setup lang="ts">
import type { Media, MediaType, QueryItem } from '../../types'
import { formatVote } from '../../composables/utils'
import posthog from 'posthog-js'

const props = defineProps<{
  type: MediaType
  item: Media
  query?: QueryItem
}>()

const handleClick = () => {
  posthog.capture('media_card_clicked', {
    media_id: props.item.id,
    media_title: props.item.title || props.item.name,
    media_type: props.item.media_type || props.type,
    vote_average: props.item.vote_average,
  })
}
</script>

<template>
  <router-link
    :to="`/${item.media_type || type}/${item.id}`"
    class="pb-2 block"
    @click="handleClick"
  >
    <div
      class="block bg-gray-400/10 p-1 aspect-[10/16] transition duration-400 hover:scale-105 z-10"
    >
      <img
        v-if="item.poster_path"
        :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`"
        :alt="item.title || item.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="h-full opacity-10 flex">
        <span class="i-ph-question ma text-4xl" />
      </div>
    </div>
    <div class="mt-2">
      {{ item.title || item.name }}
    </div>
    <div class="flex text-sm gap-2 items-center">
      <div class="opacity-60">
        ⭐ {{ formatVote(item.vote_average) }}
      </div>
    </div>
  </router-link>
</template>
