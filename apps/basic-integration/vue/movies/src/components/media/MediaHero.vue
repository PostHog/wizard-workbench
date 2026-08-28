<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import posthog from 'posthog-js'
import type { Media } from '../../types'
import { formatTime, formatVote, getTrailer } from '../../composables/utils'

const props = defineProps<{
  item: Media
}>()

const mounted = ref(false)
const showModal = ref(false)
const trailerUrl = computed(() => getTrailer(props.item))

onMounted(() => {
  mounted.value = true
})

function playTrailer() {
  if (trailerUrl.value) {
    showModal.value = true
    if (import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST) {
      posthog.capture('trailer_played', {
        media_id: props.item.id,
        media_type: props.item.media_type || 'movie',
      })
    }
  }
}

function closeModal() {
  showModal.value = false
}
</script>

<template>
  <div class="relative aspect-[3/2] lg:aspect-[25/9] bg-black">
    <div
      class="absolute top-0 right-0 left-0 lg:left-1/3 lg:bottom-0"
    >
      <img
        v-if="item.backdrop_path"
        :src="`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`"
        :alt="item.title || item.name"
        class="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
    <div
      class="absolute bottom-0 left-0 top-0 px-10 flex flex-col justify-center lg:px-25 lg:w-2/3 bg-gradient-to-r from-black via-black to-transparent lt-lg:bg-gradient-to-t lt-lg:right-0 lt-lg:p-10"
    >
      <Transition appear name="hero">
        <div v-show="mounted">
          <h1 class="mt-2 text-4xl lg:text-5xl line-clamp-2">
            {{ item.title || item.name }}
          </h1>
          <div class="flex flex-row flex-wrap gap-2 items-center mt-4">
            <div class="opacity-50">
              ⭐ {{ formatVote(item.vote_average) }}
            </div>
            <span class="opacity-50 hidden md:block">·</span>
            <div class="opacity-50 hidden md:block">
              {{ formatVote(item.vote_count) }} Reviews
            </div>
            <span v-if="item.release_date" class="opacity-50">·</span>
            <div v-if="item.release_date" class="opacity-50">
              {{ item.release_date.slice(0, 4) }}
            </div>
            <span v-if="item.runtime" class="opacity-50">·</span>
            <div v-if="item.runtime" class="opacity-50">
              {{ formatTime(item.runtime) }}
            </div>
          </div>
          <p class="mt-2 opacity-80 leading-relaxed overflow-hidden line-clamp-3 md:line-clamp-5 text-xs md:text-base">
            {{ item.overview }}
          </p>
          <div v-if="trailerUrl" class="py-5 hidden lg:block">
            <button
              type="button"
              class="flex gap-2 items-center px-6 py-3 bg-gray-400/15 hover:bg-gray-400/20 transition"
              title="Watch Trailer"
              @click="playTrailer()"
            >
              <span class="i-ph-play" />
              Watch Trailer
            </button>
          </div>
        </div>
      </Transition>
    </div>
    <div
      v-if="trailerUrl"
      class="lg:hidden absolute left-0 top-0 right-0 h-2/3 flex items-center justify-center"
    >
      <button
        type="button"
        class="p-10 text-5xl opacity-20 hover:opacity-80 transition"
        title="Watch Trailer"
        @click="playTrailer()"
      >
        <span class="i-ph-play-circle-light" />
      </button>
    </div>
  </div>

  <!-- Modal -->
  <div
    v-if="showModal && trailerUrl"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    @click="closeModal"
  >
    <div class="relative w-full max-w-4xl mx-4" @click.stop>
      <button
        type="button"
        class="absolute -top-10 right-0 text-white text-2xl hover:opacity-70"
        @click="closeModal"
      >
        ✕
      </button>
      <iframe
        :src="trailerUrl"
        class="w-full aspect-video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>
  </div>
</template>

<style scoped>
.hero-enter-active,
.hero-leave-active {
  transition: transform 0.75s cubic-bezier(0.4, 0.25, 0.3, 1), opacity 0.3s cubic-bezier(0.4, 0.25, 0.3, 1);
}

.hero-enter-from,
.hero-leave-to {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
}

.hero-enter-to,
.hero-leave-from {
  opacity: 1;
  transform: translateZ(0);
}
</style>
