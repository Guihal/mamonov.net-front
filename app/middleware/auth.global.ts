import { useUser } from '~/composables/user/useUser'

export default defineNuxtRouteMiddleware((to) => {
  const { isAurhorized } = useUser()

  const isAppRoute = to.path.startsWith('/app')
  const isAuthRoute = to.path.startsWith('/app/auth')

  if (isAppRoute && !isAuthRoute && !isAurhorized) {
    return navigateTo('/app/auth/login')
  }
})
