<script setup lang="ts">
import type { ExternalIds } from '~/types'

const props = defineProps<{
  links: ExternalIds
}>()

const imdbType = computed(() => {
  if (props.links.imdb_id?.startsWith('nm'))
    return 'name'

  return 'title'
})
</script>

<template>
  <div flex="~ row gap5" items-center text-lg mt-5>
    <a
      v-if="links.twitter_id"
      :href="`https://twitter.com/${links.twitter_id}`"
      target="_blank"
      aria-label="Link to Twitter account"
      rel="noopener"
      n-link
    >
      <span i-simple-icons:twitter aria-hidden="true" />
      <span class="sr-only">Link to Twitter account</span>
    </a>
    <a
      v-if="links.facebook_id"
      :href="`https://www.facebook.com/${links.facebook_id}`"
      target="_blank"
      aria-label="Link to Facebook account"
      rel="noopener"
      n-link
    >
      <span i-simple-icons:facebook aria-hidden="true" />
      <span class="sr-only">Link to Facebook account</span>
    </a>
    <a
      v-if="links.instagram_id"
      :href="`https://instagram.com/${links.instagram_id}`"
      target="_blank"
      aria-label="Link to Instagram account"
      rel="noopener"
      n-link
    >
      <span i-simple-icons:instagram aria-hidden="true" />
      <span class="sr-only">Link to Instagram account</span>
    </a>
    <a
      v-if="links.imdb_id"
      :href="`https://www.imdb.com/${imdbType}/${links.imdb_id}`"
      target="_blank"
      aria-label="Link to IMDb account"
      rel="noopener"
      n-link
    >
      <span i-cib:imdb aria-hidden="true" />
      <span class="sr-only">Link to IMDb account</span>
    </a>
    <a
      v-if="links.github_id"
      :href="`https://github.com/${links.github_id}`"
      target="_blank"
      aria-label="Link to GitHub account"
      rel="noopener"
      n-link
    >
      <span i-simple-icons:github aria-hidden="true" />
      <span class="sr-only">Link to GitHub account</span>
    </a>
    <a
      v-if="links.linkedin_id"
      :href="`https://www.linkedin.com/in/${links.linkedin_id}`"
      target="_blank"
      aria-label="Link to LinkedIn account"
      rel="noopener"
      n-link
    >
      <span i-simple-icons:linkedin aria-hidden="true" />
      <span class="sr-only">Link to LinkedIn account</span>
    </a>
    <a
      v-if="links.email"
      :href="links.email"
      aria-label="Link to Email"
      rel="noopener" scale-120
      n-link
    >
      <span i-ph-envelope-simple aria-hidden="true" />
      <span class="sr-only">Link to Email</span>
    </a>
    <a
      v-if="links.homepage"
      :href="links.homepage"
      aria-label="Link to Homepage"
      rel="noopener" scale-120
      n-link
    >
      <span i-ph-link-simple aria-hidden="true" />
      <span class="sr-only">Link to Homepage</span>
    </a>
    <slot />
  </div>
</template>
