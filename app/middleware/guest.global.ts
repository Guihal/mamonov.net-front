import { useUser } from '~/composables/user/useUser'

export default defineNuxtRouteMiddleware((to) => {
  const { isAurhorized } = useUser()

  const isAuthRoute = to.path.startsWith('/app/auth')

  if (isAuthRoute && isAurhorized) {
    return navigateTo('/app/categories')
  }
})
