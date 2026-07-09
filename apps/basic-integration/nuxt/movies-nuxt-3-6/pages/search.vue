<script setup lang="ts">
import type { Media } from '~/types'

const route = useRoute()
const router = useRouter()
const { $posthog } = useNuxtApp()
const input = ref((route.query.s || '').toString())
const error = ref<unknown>()
const count = ref<undefined | number>()

const items = ref<Media[]>([])
const currentSearch = ref(input.value)

function search() {
  const nextSearch = input.value.toString().trim()
  if (currentSearch.value === nextSearch)
    return

  currentSearch.value = nextSearch
  count.value = undefined
  items.value = []
  error.value = undefined

  if (nextSearch) {
    $posthog?.capture('search_started', {
      query_length: nextSearch.length,
    })
  }

  router.replace({ query: { s: nextSearch || undefined } })
}

async function fetch(page: number) {
  if (!currentSearch.value)
    return
  try {
    const data = await searchShows(currentSearch.value, page)
    count.value = data.total_results ?? count.value
    items.value.push(...data.results)

    if (page === 1) {
      $posthog?.capture('search_results_loaded', {
        query_length: currentSearch.value.length,
        results_count: data.total_results ?? data.results.length,
      })
    }
  }
  catch (e: any) {
    error.value = e
    $posthog?.capture('search_failed', {
      query_length: currentSearch.value.length,
      page,
      error_message: e?.message || 'Unknown search error',
    })
    $posthog?.captureException(e instanceof Error ? e : new Error('Search failed'))
  }
}

const throttledSearch = useDebounceFn(search, 200)

const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
}

useHead({
  title: computed(() => `Search: ${currentSearch.value}`),
})

watch(
  () => input.value,
  () => throttledSearch(),
)
</script>

<template>
  <div>
    <div flex bg-gray:10 items-center px6 py4 gap3 sticky>
      <div i-ph:magnifying-glass text-xl op50 />
      <input
        v-model="input"
        v-focus
        type="text"
        text-2xl bg-transparent outline-none w-full
        :placeholder="$t('Type to search...')"
        @keyup.enter="search"
      >
    </div>
    <div v-if="error" p8 flex flex-col gap-3 items-start>
      <h1 text-4xl text-red>
        {{ $t('Error occurred on fetching') }}
      </h1>
      <pre py2>{{ error }}</pre>
      <button n-link border px4 py1 rounded @click="error = undefined">
        {{ $t('Retry') }}
      </button>
    </div>
    <MediaAutoLoadGrid
      v-else-if="currentSearch"
      :key="currentSearch"
      :fetch="fetch"
      :items="items"
      :count="count"
      type="movie"
    >
      <div>{{ $t('Search result for: {currentSearch}', { currentSearch }) }}</div>
    </MediaAutoLoadGrid>
    <div v-else text-4xl p10 font-100 op50 text-center>
      {{ $t('Type something to search...') }}
    </div>
  </div>
</template>
