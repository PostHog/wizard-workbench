<script setup lang="ts">
import type { Video } from '~/types'

const props = defineProps<{
  item: Video
}>()

const showModal = useIframeModal()
const { $posthog: posthog } = useNuxtApp()
function play() {
  const videoLink = getVideoLink(props.item)
  if (!videoLink)
    return

  posthog?.capture('video_played', { video_type: props.item.type })
  showModal(videoLink)
}
</script>

<template>
  <button pb2 text-left data-testid="play-button" @click="play()" :aria-label="`Play ${props.item.name}`">
    <span
      block bg-gray4:10 p1 flex
      class="aspect-16/9"
      transition duration-400 relative
      hover="scale-102 z10"
      data-testid="video-thumbnail"
    >
      <NuxtImg
        :src="`/youtube/vi/${item.key}/maxresdefault.jpg`"
        width="400"
        height="600"
        format="webp"
        :alt="props.item.name"
        w-full h-full object-cover
        data-testid="video-image"
      />
      <span flex w-full h-full absolute inset-0 op20 hover:op100 transition>
        <span i-ph-play ma text-3xl data-testid="play-icon" />
      </span>
    </span>
    <span mt-2 data-testid="video-name">
      {{ props.item.name }}
    </span>
    <span op60 text-sm data-testid="video-type">
      {{ props.item.type }}
    </span>
  </button>
</template>
