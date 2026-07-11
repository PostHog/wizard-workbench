<script setup lang="ts">
import type { QueryItem } from '~/types'

const props = defineProps<{
  query: QueryItem
}>()

const { $posthog } = useNuxtApp()
const item = await listMedia(props.query.type, props.query.query, 1)

function handleExploreMore() {
  $posthog?.capture('catalog_section_explored', {
    media_type: props.query.type,
    category_query: props.query.query,
    section_title: props.query.title,
  })
}
</script>

<template>
  <CarouselBase>
    <template #title>
      {{ $t(query.title) }}
    </template>
    <template #more>
      <NuxtLink :to="`/${props.query.type}/category/${props.query.query}`" n-link @click="handleExploreMore">
        {{ $t('Explore more') }}
      </NuxtLink>
    </template>
    <MediaCard
      v-for="i of item.results"
      :key="i.id"
      :item="i"
      :type="props.query.type"
      flex-1 w-60
    />
  </CarouselBase>
</template>
