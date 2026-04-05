import { useContentArea } from '~/composables/useContentArea'
import type { WindowOb } from '../Window'
import {
  getTargetBounds,
  getCalculatedBounds,
  type WindowBoundsKey
} from '~/composables/useWindowBounds'

/**
 * Устанавливает размеры окна на всю контентную область (fullscreen).
 */
export function useOnFullscreen(windowOb: WindowOb, isForce = false) {
  const { contentArea } = useContentArea()

  const target = getTargetBounds(windowOb.id)
  const calculated = getCalculatedBounds(windowOb.id)

  const set = (prop: WindowBoundsKey, value: number) => {
    target[prop] = value
    if (isForce) {
      calculated[prop] = value
    }
  }

  set('left', 0)
  set('top', 0)
  set('width', contentArea.value.width)
  set('height', contentArea.value.height)
}
