<script setup lang="ts">
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const { login } = useAuth()

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    if (!username.value || !password.value) {
      error.value = 'Please enter both username and password'
      return
    }

    await login(username.value, password.value)
  } catch (e: any) {
    error.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-white">
          Sign in to Nuxt Movies
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          Enter any username and password to continue
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter any username"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter any password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-400 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
