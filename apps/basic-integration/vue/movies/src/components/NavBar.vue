<script setup lang="ts">
import { computed } from 'vue'
import posthog from 'posthog-js'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()

const handleLogout = async () => {
  if (import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST) {
    posthog.capture('logout_completed')
  }
  await logout()
}

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <nav
    class="flex flex-row lg:flex-col justify-evenly items-center py-5 lg:px-5 border-t lg:border-r border-base bg-black"
    role="navigation"
    aria-label="Main navigation"
  >
    <router-link
      to="/"
      :title="'Home'"
      class="text-2xl transition-colors hover:text-primary flex items-center justify-center"
      :class="{ 'text-primary': isActive('/') && route.path === '/' }"
      aria-label="Home"
    >
      <span
        :class="isActive('/') && route.path === '/' ? 'i-ph-house-fill text-primary' : 'i-ph-house'"
        aria-hidden="true"
      />
    </router-link>
    <router-link
      to="/movie"
      :title="'Movies'"
      class="text-2xl transition-colors hover:text-primary flex items-center justify-center"
      :class="{ 'text-primary': isActive('/movie') }"
      aria-label="Movies"
    >
      <span
        :class="isActive('/movie') ? 'i-ph-film-strip-fill text-primary' : 'i-ph-film-strip'"
        aria-hidden="true"
      />
    </router-link>
    <router-link
      to="/tv"
      :title="'TV Shows'"
      class="text-2xl transition-colors hover:text-primary flex items-center justify-center"
      :class="{ 'text-primary': isActive('/tv') }"
      aria-label="TV Shows"
    >
      <span
        :class="isActive('/tv') ? 'i-ph-television-simple-fill text-primary' : 'i-ph-television-simple'"
        aria-hidden="true"
      />
    </router-link>
    <router-link
      to="/search"
      :title="'Search'"
      class="text-2xl transition-colors hover:text-primary flex items-center justify-center"
      :class="{ 'text-primary': isActive('/search') }"
      aria-label="Search"
    >
      <span
        :class="isActive('/search') ? 'i-ph-magnifying-glass-fill text-primary' : 'i-ph-magnifying-glass'"
        aria-hidden="true"
      />
    </router-link>
    <div v-if="user" class="flex items-center gap-3">
      <span class="text-sm text-gray-400">{{ user }}</span>
      <button
        type="button"
        @click="handleLogout"
        class="text-2xl hover:text-primary cursor-pointer transition-colors flex items-center justify-center"
        title="Logout"
        aria-label="Logout"
      >
        <span class="i-ph-sign-out" aria-hidden="true" />
        <span class="sr-only">Logout</span>
      </button>
    </div>
  </nav>
</template>
