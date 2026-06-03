<script setup lang="ts">
const { user, logout } = useAuth()
const posthog = usePostHog()

async function handleLogout() {
  posthog?.capture('user_logged_out')
  posthog?.reset()
  await logout()
}
</script>

<template>
  <nav
    flex="~ row lg:col"
    justify-evenly items-center
    py5 lg:px5
    border="t lg:r base"
    bg-black
    aria-label="Main navigation"
  >
    <NuxtLink
      v-slot="{ isActive }"
      to="/"
      :title="$t('Home')"
      class="text-2xl transition-colors hover:text-primary flex items-center justify-center"
      :aria-label="$t('Home')"
    >
      <span :class="isActive ? 'i-ph-house-fill text-primary' : 'i-ph-house'" aria-hidden="true" />
      <span class="sr-only">{{ $t('Home') }}</span>
    </NuxtLink>
    <NuxtLink
      v-slot="{ isActive }"
      to="/movie"
      :title="$t('Movies')"
      class="text-2xl transition-colors hover:text-primary flex items-center justify-center"
      :aria-label="$t('Movies')"
    >
      <span :class="isActive ? 'i-ph-film-strip-fill text-primary' : 'i-ph-film-strip'" aria-hidden="true" />
      <span class="sr-only">{{ $t('Movies') }}</span>
    </NuxtLink>
    <NuxtLink
      v-slot="{ isActive }"
      to="/tv"
      :title="$t('TV Shows')"
      class="text-2xl transition-colors hover:text-primary flex items-center justify-center"
      :aria-label="$t('TV Shows')"
    >
      <span :class="isActive ? 'i-ph-television-simple-fill text-primary' : 'i-ph-television-simple'" aria-hidden="true" />
      <span class="sr-only">{{ $t('TV Shows') }}</span>
    </NuxtLink>
    <NuxtLink
      v-slot="{ isActive }"
      to="/search"
      :title="$t('Search')"
      class="text-2xl transition-colors hover:text-primary flex items-center justify-center"
      :aria-label="$t('Search')"
    >
      <span :class="isActive ? 'i-ph-magnifying-glass-fill text-primary' : 'i-ph-magnifying-glass'" aria-hidden="true" />
      <span class="sr-only">{{ $t('Search') }}</span>
    </NuxtLink>
    <div v-if="user" class="flex items-center gap-3">
      <span class="text-sm text-gray-400">{{ user }}</span>
      <button
        type="button"
        @click="handleLogout"
        class="text-2xl hover:text-primary cursor-pointer transition-colors flex items-center justify-center"
        :title="$t('Logout')"
        :aria-label="$t('Logout')"
      >
        <span class="i-ph-sign-out" aria-hidden="true" />
        <span class="sr-only">{{ $t('Logout') }}</span>
      </button>
    </div>
  </nav>
</template>
