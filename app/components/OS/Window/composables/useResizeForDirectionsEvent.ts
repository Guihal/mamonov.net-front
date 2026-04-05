import { useFocusWindowController } from '~/composables/useFocusController'
import { syncBounds } from '../utils/syncBounds'
import type { WindowOb } from '../Window'
import { useResizeForDirections, type ChainedKey } from './useResizeForDirections'

/**
 * Обработчик pointer-событий для изменения размера окна.
 */
export function useResizeForDirectionsEvent(windowOb: WindowOb, directions: ChainedKey[]) {
  const controlled = useResizeForDirections(windowOb, directions)
  const { focus } = useFocusWindowController()

  const onPointerDown = (ev: PointerEvent) => {
    windowOb.states.resize = true
    ev.preventDefault()

    syncBounds(windowOb)

    delete windowOb.states.fullscreen
    delete windowOb.states.collapsed

    ;(ev.target as HTMLElement).setPointerCapture(ev.pointerId)

    const onPointerMove = (ev: PointerEvent) => {
      if ('left' in controlled || 'right' in controlled) {
        const key = 'left' in controlled ? 'left' : 'right'
        controlled[key](ev.clientX, ev.clientY)
      }
      if ('top' in controlled || 'bottom' in controlled) {
        const key = 'top' in controlled ? 'top' : 'bottom'
        controlled[key](ev.clientX, ev.clientY)
      }
    }

    const onPointerUp = () => {
      focus(windowOb.id)
      delete windowOb.states.resize
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  return { onPointerDown }
}
