<script setup lang="ts">
import type { Media, MediaType } from '~/types'

const props = defineProps<{
  type: MediaType
  item: Media
}>()
const { $posthog } = useNuxtApp()

function handleClick() {
  $posthog?.capture('media_card_selected', {
    media_id: props.item.id,
    media_type: props.item.media_type || props.type,
    media_title: props.item.title || props.item.name,
  })
}
</script>

<template>
  <NuxtLink
    :to="`/${props.item.media_type || props.type}/${props.item.id}`" pb2
    @click="handleClick"
  >
    <div
      block bg-gray4:10 p1
      class="aspect-10/16"
      transition duration-400
      hover="scale-105 z10"
    >
      <NuxtImg
        v-if="props.item.poster_path"
        width="400"
        height="600"
        format="webp"
        :src="`/tmdb${props.item.poster_path}`"
        :alt="props.item.title || props.item.name"
        w-full h-full object-cover contain-layout
        :style="{ 'view-transition-name': `item-${props.item.id}` }"
      />
      <div v-else h-full op10 flex>
        <div i-ph:question ma text-4xl />
      </div>
    </div>
    <div mt-2>
      {{ props.item.title || props.item.name }}
    </div>
    <div flex text-sm gap-2 items-center>
      <StarsRate w-20 :value="props.item.vote_average" />
      <div op60>
        {{ props.item.vote_average }}
      </div>
    </div>
  </NuxtLink>
</template>
