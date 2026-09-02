<script setup lang="ts">
import type { Media } from '~/types'

defineProps<{
  item: Media
}>()

const show = useImageModal()
const { $posthog: posthog } = useNuxtApp()

function viewPhoto(images: NonNullable<Media['images']>['backdrops'], index: number, collection: 'backdrops' | 'posters') {
  posthog?.capture('photo_viewed', { collection })
  show(images, index)
}
</script>

<template>
  <div flex="~ col" px4 md:px16 py8 gap6>
    <div flex gap-2 items-baseline>
      <div text-2xl>
        {{ $t('Backdrops') }}
      </div>
      <div text-sm op50>
        {{ $t('{numberOfImages} Images', { numberOfImages: item.images?.backdrops?.length }) }}
      </div>
    </div>
    <div grid="~ cols-minmax-20rem" gap4>
      <PhotoCard
        v-for="i, idx of item.images?.backdrops"
        :key="i.file_path"
        :item="i"
        class="aspect-16/9"
        w-full
        @click="viewPhoto(item.images!.backdrops, idx, 'backdrops')"
      />
    </div>
    <div flex mt-10 gap-2 items-baseline>
      <div text-2xl>
        {{ $t('Posters') }}
      </div>
      <div text-sm op50>
        {{ $t('{numberOfImages} Images', { numberOfImages: item.images?.posters?.length }) }}
      </div>
    </div>
    <div grid="~ cols-minmax-10rem lg:cols-minmax-15rem" gap4>
      <PhotoCard
        v-for="i, idx of item.images?.posters"
        :key="i.file_path"
        :item="i"
        class="aspect-9/16"
        @click="viewPhoto(item.images!.posters, idx, 'posters')"
      />
    </div>
  </div>
</template>
