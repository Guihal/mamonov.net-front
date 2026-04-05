import { useFocusWindowController } from '~/composables/useFocusController'
import { syncBounds } from '../utils/syncBounds'
import type { WindowOb } from '../Window'
import { useResizeForDirections, type ChainedKey } from './useResizeForDirections'

/**
 * Обработчик событий для изменения размера окна.
 * Поддерживает Pointer Events (мышь) и Touch Events (iOS/Android).
 */
export function useResizeForDirectionsEvent(windowOb: WindowOb, directions: ChainedKey[]) {
  const controlled = useResizeForDirections(windowOb, directions)
  const { focus } = useFocusWindowController()

  const startResize = () => {
    windowOb.states.resize = true
    syncBounds(windowOb)
    delete windowOb.states.fullscreen
    delete windowOb.states.collapsed
  }

  const applyResize = (clientX: number, clientY: number) => {
    if ('left' in controlled || 'right' in controlled) {
      const key = 'left' in controlled ? 'left' : 'right'
      controlled[key](clientX, clientY)
    }
    if ('top' in controlled || 'bottom' in controlled) {
      const key = 'top' in controlled ? 'top' : 'bottom'
      controlled[key](clientX, clientY)
    }
  }

  const endResize = () => {
    focus(windowOb.id)
    delete windowOb.states.resize
  }

  const onPointerDown = (ev: PointerEvent) => {
    if (ev.pointerType === 'touch') return
    ev.preventDefault()
    startResize()
    ;(ev.target as HTMLElement).setPointerCapture(ev.pointerId)

    const onPointerMove = (ev: PointerEvent) => applyResize(ev.clientX, ev.clientY)
    const onPointerUp = () => {
      endResize()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const onTouchStart = (ev: TouchEvent) => {
    const touch = ev.touches[0]
    if (!touch) return
    startResize()

    const onTouchMove = (ev: TouchEvent) => {
      ev.preventDefault()
      const t = ev.touches[0]
      if (t) applyResize(t.clientX, t.clientY)
    }

    const onTouchEnd = () => {
      endResize()
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }

    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
  }

  return { onPointerDown, onTouchStart }
}
