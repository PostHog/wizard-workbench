<script setup lang="ts">
import type { Image, Media } from '~/types'

defineProps<{
  item: Media
}>()

const { $posthog } = useNuxtApp()
const show = useImageModal()

function openPhotoGallery(images: Image[], index: number, photoType: 'backdrop' | 'poster') {
  show(images, index)
  $posthog?.capture('photo_gallery_opened', {
    photo_type: photoType,
    position: index + 1,
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
        @click="openPhotoGallery(item.images!.backdrops, idx, 'backdrop')"
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
        @click="openPhotoGallery(item.images!.posters, idx, 'poster')"
      />
    </div>
  </div>
</template>
