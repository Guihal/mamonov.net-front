import type { WindowOb } from '../Window'
import { getTargetBounds } from '~/composables/useWindowBounds'
import { OFFSET } from '~/utils/constants/OFFSET'

/**
 * Автоматический переход в fullscreen при перетаскивании окна за границы.
 */
export function useWindowFullscreenAutoSet(windowOb: WindowOb) {
  const { contentArea } = useContentArea()
  const target = getTargetBounds(windowOb.id)

  const isOutOfBounds = () => {
    const left = target.left
    const top = target.top
    const width = target.width
    const height = target.height
    return (
      left < OFFSET ||
      top < OFFSET ||
      left + width > contentArea.value.width - OFFSET ||
      top + height > contentArea.value.height - OFFSET
    )
  }

  useSetChainedWatchers(
    () => windowOb.states.drag === true,
    () => ({
      left: target.left,
      top: target.top,
      width: target.width,
      height: target.height
    }),
    () => {
      if (isOutOfBounds()) {
        windowOb.states['fullscreen-ready'] = true
      } else {
        delete windowOb.states['fullscreen-ready']
      }
    }
  )

  watch(
    () => windowOb.states.drag === true,
    (v) => {
      if (!v)
        setTimeout(() => {
          if (windowOb.states['fullscreen-ready']) windowOb.states['fullscreen'] = true
          delete windowOb.states['fullscreen-ready']
        }, 10)
    },
    {
      immediate: true
    }
  )
}
