<script setup lang="ts">
import type { Image, Media } from '~/types'

const props = defineProps<{
  item: Media
}>()

const show = useImageModal()
const { $posthog: posthog } = useNuxtApp()

function showImage(images: Image[], index: number, imageKind: 'backdrop' | 'poster') {
  show(images, index)
  posthog?.capture('media_image_viewed', {
    media_id: props.item.id,
    image_kind: imageKind,
  })
}
</script>

<template>
  <div flex="~ col" px4 md:px16 py8 gap6>
    <div flex gap-2 items-baseline>
      <div text-2xl>
        {{ $t('Backdrops') }}
      </div>
      <div text-sm op50>
        {{ $t('{numberOfImages} Images', { numberOfImages: item.images?.backdrops.length }) }}
      </div>
    </div>
    <div grid="~ cols-minmax-20rem" gap4>
      <PhotoCard
        v-for="i, idx of item.images?.backdrops"
        :key="i.file_path"
        :item="i"
        class="aspect-16/9"
        w-full
        @click="showImage(item.images!.backdrops, idx, 'backdrop')"
      />
    </div>
    <div flex mt-10 gap-2 items-baseline>
      <div text-2xl>
        {{ $t('Posters') }}
      </div>
      <div text-sm op50>
        {{ $t('{numberOfImages} Images', { numberOfImages: item.images?.posters.length }) }}
      </div>
    </div>
    <div grid="~ cols-minmax-15rem" gap4>
      <PhotoCard
        v-for="i, idx of item.images?.posters"
        :key="i.file_path"
        :item="i"
        class="aspect-9/16"
        @click="showImage(item.images!.posters, idx, 'poster')"
      />
    </div>
  </div>
</template>
