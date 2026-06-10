export default defineNuxtRouteMiddleware((to) => {
  // Check cookie directly for server-side compatibility
  const cookie = useCookie<string | null>('auth-user')
  const isAuthenticated = !!cookie.value

  // Allow access to login page
  if (to.path === '/login') {
    if (isAuthenticated)
      return navigateTo('/')

    return
  }

  // Protect all other routes
  if (!isAuthenticated)
    return navigateTo('/login')
})
