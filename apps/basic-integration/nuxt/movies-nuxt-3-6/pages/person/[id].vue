<script setup lang="ts">
const id = useRouteParam<string>('id')
const person = await getPerson(id.value)
const { $posthog: posthog } = useNuxtApp()

const $img = useImage()

useHead({
  title: person.name,
  meta: [
    { name: 'description', content: person.biography || person.name },
    { property: 'og:image', content: $img(`/tmdb${person.profile_path}`, { width: 1200, height: 630 }) },
  ],
})

onMounted(() => {
  posthog?.capture('person_detail_viewed', {
    person_id: id.value,
  })
})
</script>

<template>
  <div>
    <PersonDetails :item="person" />
    <TheFooter />
  </div>
</template>
