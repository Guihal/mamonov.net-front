import { useContentArea } from '~/composables/useContentArea'
import type { WindowOb } from '../Window'
import { useOnFullscreen } from './useOnFullScreen'

/**
 * Устанавливает fullscreen при монтировании окна.
 */
export function useSetFullscreenObserver(windowOb: WindowOb) {
  const { contentArea } = useContentArea()

  let isMounted = false

  useSetChainedWatchers(
    () => windowOb.states.fullscreen === true,
    contentArea,
    () => {
      useOnFullscreen(windowOb, !isMounted)
    },
    {
      immediate: true
    }
  )

  onMounted(() => {
    windowOb.states.fullscreen = true
    delete windowOb.states['fullscreen-ready']

    setTimeout(() => {
      isMounted = true
    }, 100)
  })
}
