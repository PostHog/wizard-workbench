<script setup lang="ts">
import type { Person } from '~/types'

defineProps<{
  item: Person
}>()

const tab = ref<'known' | 'credits' | 'photos'>('known')
const { $posthog } = useNuxtApp()

function selectTab(selectedTab: 'known' | 'credits' | 'photos') {
  tab.value = selectedTab
  $posthog?.capture('person_tab_selected', { tab: selectedTab })
}
</script>

<template>
  <PersonInfo :item="item" />
  <div flex items-center justify-center gap8 py6>
    <button n-tab :class="{ 'n-tab-active': tab === 'known' }" @click="selectTab('known')">
      {{ $t('Known For') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'credits' }" @click="selectTab('credits')">
      {{ $t('Credits') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'photos' }" @click="selectTab('photos')">
      {{ $t('Person Photos') }}
    </button>
  </div>
  <MediaGrid v-if="tab === 'known'">
    <template
      v-for="i of item.combined_credits?.cast"
      :key="i.id"
    >
      <MediaCard
        v-if="i.release_date"
        :item="i"
        type="movie"
      />
    </template>
  </MediaGrid>
  <PersonCredits v-if="tab === 'credits'" :item="item" />
  <PersonPhotos v-if="tab === 'photos'" :item="item" />
</template>
