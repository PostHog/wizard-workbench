<script setup lang="ts">
import { ref } from 'vue'
import posthog from 'posthog-js'

const scrollEl = ref<HTMLDivElement>()

function scrollLeft() {
  posthog.capture('carousel_scrolled', {
    direction: 'left',
    viewport_width: window.innerWidth,
  })
  scrollEl.value?.scrollBy({
    left: -window.innerWidth,
    behavior: 'smooth',
  })
}

function scrollRight() {
  posthog.capture('carousel_scrolled', {
    direction: 'right',
    viewport_width: window.innerWidth,
  })
  scrollEl.value?.scrollBy({
    left: window.innerWidth,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div>
    <div class="flex py-3 px-10 items-center mt-5">
      <div class="text-2xl">
        <slot name="title" />
      </div>
      <div class="flex-auto" />
      <slot name="more" />
    </div>
    <div class="relative">
      <div ref="scrollEl" class="overflow-y-auto">
        <div class="flex gap-2 w-max p-2 px-10">
          <slot />
        </div>
      </div>
      <button
        type="button"
        class="flex flex-col absolute top-0 left-0 bottom-0 bg-black/50 p-3 items-center justify-center opacity-0 hover:opacity-100 transition pointer-events-none hover:pointer-events-auto z-10"
        title="Scroll left"
        @click="scrollLeft()"
      >
        <span class="i-ph-caret-left-light text-3xl text-white" />
      </button>
      <button
        type="button"
        class="flex flex-col absolute top-0 right-0 bottom-0 bg-black/50 p-3 items-center justify-center opacity-0 hover:opacity-100 transition pointer-events-none hover:pointer-events-auto z-10"
        title="Scroll right"
        @click="scrollRight()"
      >
        <span class="i-ph-caret-right-light text-3xl text-white" />
      </button>
    </div>
  </div>
</template>
