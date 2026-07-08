import { createRouter, createWebHistory } from 'vue-router'
import posthog from 'posthog-js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: () => import('../views/MediaDetailView.vue'),
      props: { type: 'movie' },
    },
    {
      path: '/tv/:id',
      name: 'tv-detail',
      component: () => import('../views/MediaDetailView.vue'),
      props: { type: 'tv' },
    },
    {
      path: '/movie',
      name: 'movies',
      component: () => import('../views/MediaListView.vue'),
      props: { type: 'movie' },
    },
    {
      path: '/tv',
      name: 'tv',
      component: () => import('../views/MediaListView.vue'),
      props: { type: 'tv' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'catch-all',
      component: () => import('../views/MediaDetailView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const storedUser = localStorage.getItem('auth-user')
  const isAuthenticated = !!storedUser

  if (storedUser) {
    posthog.identify(storedUser)
  }

  if (to.path === '/login') {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
    return
  }

  if (to.path !== '/login' && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
