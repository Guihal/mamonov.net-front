import { OFFSET } from '~/utils/constants/OFFSET'
import type { WindowOb } from '../Window'
import { getTargetBounds } from '~/composables/useWindowBounds'

/**
 * Composable для перетаскивания окна за заголовок.
 * Поддерживает Pointer Events (мышь) и Touch Events (iOS/Android).
 */
export function useMove(windowOb: WindowOb) {
  const lastX = ref(0)
  const lastY = ref(0)

  const { contentArea } = useContentArea()
  const { focus } = useFocusWindowController()
  const target = getTargetBounds(windowOb.id)

  const isOutOfBounds = () => {
    return (
      lastX.value < OFFSET ||
      lastY.value < OFFSET ||
      lastX.value > contentArea.value.width - OFFSET * 2 ||
      lastY.value > contentArea.value.height - OFFSET * 2
    )
  }

  const callback = () => {
    if (isOutOfBounds()) {
      windowOb.states['fullscreen-ready'] = true
    } else {
      delete windowOb.states['fullscreen-ready']
    }
  }

  watch(lastX, callback, { immediate: true })
  watch(lastY, callback, { immediate: true })

  const startDrag = (clientX: number, clientY: number): boolean => {
    if (windowOb.states.fullscreen) return false
    focus(windowOb.id)
    windowOb.states.drag = true
    lastX.value = clientX
    lastY.value = clientY
    return true
  }

  const applyMove = (clientX: number, clientY: number) => {
    const deltaX = clientX - lastX.value
    const deltaY = clientY - lastY.value
    lastX.value = clientX
    lastY.value = clientY
    target.left += deltaX
    target.top += deltaY
  }

  const endDrag = (clientX: number, clientY: number) => {
    lastX.value = clientX
    lastY.value = clientY
    delete windowOb.states.drag
    if (windowOb.states['fullscreen-ready']) {
      windowOb.states.fullscreen = true
    }
    delete windowOb.states['fullscreen-ready']
  }

  const onPointerDown = (ev: PointerEvent) => {
    if (ev.pointerType === 'touch') return
    if (!startDrag(ev.clientX, ev.clientY)) return

    ;(ev.target as HTMLElement).setPointerCapture(ev.pointerId)

    const onPointerMove = (ev: PointerEvent) => applyMove(ev.clientX, ev.clientY)
    const onPointerUp = (ev: PointerEvent) => {
      endDrag(ev.clientX, ev.clientY)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  const onTouchStart = (ev: TouchEvent) => {
    const touch = ev.touches[0]
    if (!touch || !startDrag(touch.clientX, touch.clientY)) return

    const onTouchMove = (ev: TouchEvent) => {
      ev.preventDefault()
      const t = ev.touches[0]
      if (t) applyMove(t.clientX, t.clientY)
    }

    const onTouchEnd = (ev: TouchEvent) => {
      const t = ev.changedTouches[0]
      endDrag(t ? t.clientX : lastX.value, t ? t.clientY : lastY.value)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }

    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd)
  }

  return { onPointerDown, onTouchStart }
}
