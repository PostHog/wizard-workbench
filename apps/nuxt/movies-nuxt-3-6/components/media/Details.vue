<script setup lang="ts">
import type { Media, MediaType } from '~/types'

const props = defineProps<{
  item: Media
  type: MediaType
}>()

const tab = ref<'overview' | 'videos' | 'photos'>('overview')
const { $posthog: posthog } = useNuxtApp()

function changeTab(newTab: 'overview' | 'videos' | 'photos') {
  if (tab.value === newTab)
    return
  tab.value = newTab
  posthog?.capture('media_tab_changed', {
    tab: newTab,
    media_id: props.item.id,
    media_type: props.type,
    media_title: props.item.name || props.item.title,
  })
}
</script>

<template>
  <div flex items-center justify-center gap8 py6>
    <button n-tab :class="{ 'n-tab-active': tab === 'overview' }" @click="changeTab('overview')">
      {{ $t('Overview') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'videos' }" @click="changeTab('videos')">
      {{ $t('Videos') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'photos' }" @click="changeTab('photos')">
      {{ $t('Media Photos') }}
    </button>
  </div>
  <MediaOverview v-if="tab === 'overview'" :item="item" :type="type" />
  <MediaVideos v-if="tab === 'videos'" :item="item" />
  <MediaPhotos v-if="tab === 'photos'" :item="item" />
</template>
