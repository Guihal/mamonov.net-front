import { useOsIsolated } from '~/composables/os/useOsIsolated'
import { debounce } from '../utils/debounce'
import type { WindowOb } from '../Window'

export function useWindowRoute(windowOb: WindowOb) {
  const route = useRoute()
  const { isIsolated } = useOsIsolated()

  const windowRoute = ref(windowOb.targetFile.value)

  const { queuedPush, isQueueEmpty } = useQueuedRouter()
  let isProgrammaticNavigation = true

  watch(
    () => windowOb.states.focused,
    (focused) => {
      if (!focused) return
      if (isIsolated.value) return

      const path = windowOb.targetFile.value
      if (!path || route.path === path) return

      isProgrammaticNavigation = true

      queuedPush(path).finally(() => {
        isProgrammaticNavigation = false
      })
    },
    {
      immediate: true
    }
  )

  watch(
    () => windowOb.targetFile.value,
    (newPath) => {
      if (!newPath) return

      windowRoute.value = newPath

      if (!windowOb.states.focused) return

      if (route.path !== newPath) {
        if (isIsolated.value) return
        isProgrammaticNavigation = true
        queuedPush(newPath).finally(() => {
          isProgrammaticNavigation = false
        })
      }
    },
    {
      immediate: true
    }
  )

  watch(
    () => route.path,
    debounce((newPath) => {
      if (isProgrammaticNavigation) return
      if (!windowOb.states.focused) return
      if (!newPath) return

      windowRoute.value = newPath
      windowOb.targetFile.value = newPath
    }, 16)
  )

  return computed(() => windowRoute.value)
}
