import { useMascotStore } from '~/composables/mascot/useMascotStore'

export default defineNuxtRouteMiddleware((to, from) => {
  const isLessonRoute = (path: string) => /^\/app\/categories\/[^/]+\/[^/]+$/.test(path)

  if (isLessonRoute(from.path) && !isLessonRoute(to.path)) {
    const mascot = useMascotStore()
    mascot.$reset()
  }
})
