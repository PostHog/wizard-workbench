<script setup lang="ts">
import posthog from 'posthog-js'
import type { Person } from '~/types'

const props = defineProps<{
  item: Person
}>()

function handleClick() {
  posthog.capture('person_card_clicked', {
    person_id: props.item.id,
    person_name: props.item.name,
    known_for: props.item.known_for_department,
  })
}
</script>

<template>
  <NuxtLink :to="`/person/${item.id}`" @click="handleClick">
    <div
      block bg-gray4:10 p1
      class="aspect-10/16"
      transition duration-400
      hover="scale-105 z10"
    >
      <NuxtImg
        v-if="item.profile_path"
        width="500"
        height="800"
        format="webp"
        :src="`/tmdb${item.profile_path}`"
        :alt="item.name"
        w-full h-full object-cover
      />
      <div v-else h-full op10>
        <div i-ph:user ma text-4xl />
      </div>
    </div>
    <div mt-2>
      {{ item.name }}
    </div>
    <div op50>
      {{ item.character || item.known_for_department }}
    </div>
  </NuxtLink>
</template>
