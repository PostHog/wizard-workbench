<script setup lang="ts">
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const { login } = useAuth()
const { $posthog: posthog } = useNuxtApp()

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const response = await login(username.value, password.value)
    if (response.success)
      posthog?.capture('login_completed')
  }
  catch (e: any) {
    error.value = e.message || 'Login failed'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
    <div class="max-w-md w-full space-y-8 p-10 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-2">
          Welcome Back
        </h1>
        <p class="text-gray-400 text-sm">
          Sign in to continue to Nuxt Movies
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-5">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              autocomplete="username"
              class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your username"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
              :disabled="loading"
            />
          </div>
        </div>

        <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p class="text-red-400 text-sm text-center">
            {{ error }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-medium rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign in</span>
        </button>

        <p class="text-center text-xs text-gray-500 mt-4">
          Demo mode: Any username and password will work
        </p>
      </form>
    </div>
  </div>
</template>
