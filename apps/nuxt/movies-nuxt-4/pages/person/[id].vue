<script setup lang="ts">
const id = useRouteParam<string>('id')
const person = await getPerson(id.value)

const $img = useImage()
const posthog = usePostHog()

useHead({
  title: person.name,
  meta: [
    { name: 'description', content: person.biography || person.name },
    { property: 'og:image', content: $img(`/tmdb${person.profile_path}`, { width: 1200, height: 630 }) },
  ],
})

onMounted(() => {
  posthog?.capture('person_profile_viewed', {
    person_id: id.value,
    person_name: person.name,
  })
})
</script>

<template>
  <div>
    <PersonDetails :item="person" />
    <TheFooter />
  </div>
</template>
