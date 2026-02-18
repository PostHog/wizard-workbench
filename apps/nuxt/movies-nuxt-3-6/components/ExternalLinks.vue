<script setup lang="ts">
import type { ExternalIds } from '~/types'

defineProps<{
  links: ExternalIds
}>()

const { $posthog: posthog } = useNuxtApp()

function trackExternalLinkClick(platform: string, url: string) {
  posthog?.capture('external_link_clicked', {
    platform,
    url,
  })
}
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
      @click="trackExternalLinkClick('twitter', `https://twitter.com/${links.twitter_id}`)"
    >
      <div i-simple-icons:twitter />
    </a>
    <a
      v-if="links.facebook_id"
      :href="`https://www.facebook.com/${links.facebook_id}`"
      target="_blank"
      aria-label="Link to Facebook account"
      rel="noopener"
      n-link
      @click="trackExternalLinkClick('facebook', `https://www.facebook.com/${links.facebook_id}`)"
    >
      <div i-simple-icons:facebook />
    </a>
    <a
      v-if="links.instagram_id"
      :href="`https://instagram.com/${links.instagram_id}`"
      target="_blank"
      aria-label="Link to Instagram account"
      rel="noopener"
      n-link
      @click="trackExternalLinkClick('instagram', `https://instagram.com/${links.instagram_id}`)"
    >
      <div i-simple-icons:instagram />
    </a>
    <a
      v-if="links.imdb_id"
      :href="`https://www.imdb.com/movie/${links.imdb_id}`"
      target="_blank"
      aria-label="Link to IMDb account"
      rel="noopener"
      n-link
      @click="trackExternalLinkClick('imdb', `https://www.imdb.com/movie/${links.imdb_id}`)"
    >
      <div i-cib:imdb />
    </a>
    <a
      v-if="links.github_id"
      :href="`https://github.com/${links.github_id}`"
      target="_blank"
      aria-label="Link to GitHub account"
      rel="noopener"
      n-link
      @click="trackExternalLinkClick('github', `https://github.com/${links.github_id}`)"
    >
      <div i-simple-icons:github />
    </a>
    <a
      v-if="links.linkedin_id"
      :href="`https://www.linkedin.com/in/${links.linkedin_id}`"
      target="_blank"
      aria-label="Link to LinkedIn account"
      rel="noopener"
      n-link
      @click="trackExternalLinkClick('linkedin', `https://www.linkedin.com/in/${links.linkedin_id}`)"
    >
      <div i-simple-icons:linkedin />
    </a>
    <a
      v-if="links.email"
      :href="links.email"
      aria-label="Link to Email"
      rel="noopener" scale-120
      n-link
      @click="trackExternalLinkClick('email', links.email)"
    >
      <div i-ph-envelope-simple />
    </a>
    <a
      v-if="links.homepage"
      :href="links.homepage"
      aria-label="Link to Homepage"
      rel="noopener" scale-120
      n-link
      @click="trackExternalLinkClick('homepage', links.homepage)"
    >
      <div i-ph-link-simple />
    </a>
    <slot />
  </div>
</template>
