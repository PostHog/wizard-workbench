<script setup lang="ts">
import { computed, onMounted } from 'vue'
import posthog from 'posthog-js'
import { useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { identifyAuthenticatedUser } from './composables/posthog'
import NavBar from './components/NavBar.vue'

const route = useRoute()
const { isAuthenticated, user } = useAuth()
const showNavBar = computed(() => isAuthenticated.value && route.path !== '/login')

onMounted(async () => {
  if (user.value) {
    await identifyAuthenticatedUser(user.value)
    posthog.capture('session_restored', {
      auth_state: 'authenticated',
    })
  }
})
</script>

<template>
  <div class="h-full w-full font-sans overflow-hidden app-layout">
    <div id="app-scroller" class="overflow-x-hidden overflow-y-auto relative min-h-full">
      <router-view :key="$route.fullPath" />
    </div>
    <NavBar v-if="showNavBar" />
  </div>
</template>

<style>
html,
body,
#app {
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #111;
  color: white;
  color-scheme: dark;
}

.app-layout {
  display: grid;
  grid-template-rows: 1fr max-content;
}

@media (min-width: 1024px) {
  .app-layout {
    grid-template-columns: 1fr max-content;
    grid-template-rows: 1fr;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
