export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  
  // Allow access to login page
  if (to.path === '/login') {
    if (isAuthenticated.value) {
      return navigateTo('/')
    }
    return
  }

  // Protect all other routes
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
