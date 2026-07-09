<script setup lang="ts">
const id = useRouteParam<string>('id')
const person = await getPerson(id.value)

const $img = useImage()
const { $posthog } = useNuxtApp()

onMounted(() => {
  $posthog?.capture('person_detail_viewed', {
    person_id: person.id,
    known_for_count: person.combined_credits?.cast?.length || 0,
  })
})

useHead({
  title: person.name,
  meta: [
    { name: 'description', content: person.biography || person.name },
    { property: 'og:image', content: $img(`/tmdb${person.profile_path}`, { width: 1200, height: 630 }) },
  ],
})
</script>

<template>
  <div>
    <PersonDetails :item="person" />
    <TheFooter />
  </div>
</template>
