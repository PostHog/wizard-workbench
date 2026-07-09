<script setup lang="ts">
const posthog = usePostHog()
const id = useRouteParam<string>('id')
const person = await getPerson(id.value)

const $img = useImage()

useHead({
  title: person.name,
  meta: [
    { name: 'description', content: person.biography || person.name },
    { property: 'og:image', content: $img(`/tmdb${person.profile_path}`, { width: 1200, height: 630 }) },
  ],
})

posthog?.capture('person_details_viewed', {
  person_id: Number(id.value),
  has_biography: Boolean(person.biography),
  has_profile_image: Boolean(person.profile_path),
})
</script>

<template>
  <div>
    <PersonDetails :item="person" />
    <TheFooter />
  </div>
</template>
