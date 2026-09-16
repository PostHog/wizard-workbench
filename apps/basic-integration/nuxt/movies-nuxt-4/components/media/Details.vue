<script setup lang="ts">
import type { Media, MediaType } from '~/types'

const props = defineProps<{
  item: Media
  type: MediaType
}>()

const tab = ref<'overview' | 'videos' | 'photos'>('overview')
const { $posthog } = useNuxtApp()

function selectTab(selectedTab: typeof tab.value) {
  tab.value = selectedTab
  $posthog?.capture('media_detail_tab_selected', {
    media_id: props.item.id,
    media_type: props.type,
    tab: selectedTab,
  })
}
</script>

<template>
  <div flex items-center justify-center gap8 py6>
    <button n-tab :class="{ 'n-tab-active': tab === 'overview' }" @click="selectTab('overview')">
      {{ $t('Overview') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'videos' }" @click="selectTab('videos')">
      {{ $t('Videos') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'photos' }" @click="selectTab('photos')">
      {{ $t('Media Photos') }}
    </button>
  </div>
  <MediaOverview v-if="tab === 'overview'" :item="item" :type="type" />
  <MediaVideos v-if="tab === 'videos'" :item="item" />
  <MediaPhotos v-if="tab === 'photos'" :item="item" />
</template>
