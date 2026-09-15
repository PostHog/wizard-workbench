<script setup lang="ts">
const { $posthog } = useNuxtApp();

function captureEvent() {
  $posthog?.capture("button_clicked");
}
</script>

<template>
  <main style="padding: 2rem; font-family: system-ui">
    <h1>Nuxt 3.6 + PostHog test fixture</h1>
    <p>This page exists to give the bundler something to ship.</p>
    <button @click="captureEvent">Capture event</button>
  </main>
</template>
