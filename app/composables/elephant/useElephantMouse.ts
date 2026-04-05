export function useElephantMouse(elephantRef: Ref<HTMLElement | null>) {
  const translateX = ref(0)
  const translateY = ref(0)

  let rect: DOMRect | null = null

  function updateRect() {
    if (elephantRef.value) {
      rect = elephantRef.value.getBoundingClientRect()
    }
  }

  const MAX_OFFSET = 15

  function onMouseMove(e: MouseEvent) {
    if (!elephantRef.value) return
    rect = elephantRef.value.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY

    const progressX = (deltaX / rect.width) * MAX_OFFSET * 2
    const progressY = (deltaY / rect.height) * MAX_OFFSET * 2

    translateX.value = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, progressX))
    translateY.value = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, progressY))
  }

  function onResize() {
    updateRect()
  }

  function start() {
    updateRect()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)
  }

  function stop() {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
  }

  return { translateX, translateY, start, stop }
}
