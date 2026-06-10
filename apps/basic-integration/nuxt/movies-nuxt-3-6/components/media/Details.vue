<script setup lang="ts">
import posthog from 'posthog-js'
import type { Media, MediaType } from '~/types'

const props = defineProps<{
  item: Media
  type: MediaType
}>()

const tab = ref<'overview' | 'videos' | 'photos'>('overview')

function switchTab(newTab: 'overview' | 'videos' | 'photos') {
  tab.value = newTab
  posthog.capture('media_tab_changed', {
    tab: newTab,
    media_id: props.item.id,
    media_title: props.item.title || props.item.name,
    media_type: props.type,
  })
}
</script>

<template>
  <div flex items-center justify-center gap8 py6>
    <button n-tab :class="{ 'n-tab-active': tab === 'overview' }" @click="switchTab('overview')">
      {{ $t('Overview') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'videos' }" @click="switchTab('videos')">
      {{ $t('Videos') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'photos' }" @click="switchTab('photos')">
      {{ $t('Media Photos') }}
    </button>
  </div>
  <MediaOverview v-if="tab === 'overview'" :item="item" :type="type" />
  <MediaVideos v-if="tab === 'videos'" :item="item" />
  <MediaPhotos v-if="tab === 'photos'" :item="item" />
</template>
