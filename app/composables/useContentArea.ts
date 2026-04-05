const viewport = ref({ width: 0, height: 0 })

const taskbarHeight = ref(0)

export type ContentAreaObj = {
  width: number
  height: number
}

export type ContentArea = Ref<ContentAreaObj>

const contentArea: ContentArea = computed(() => ({
  width: viewport.value.width,
  height: viewport.value.height - taskbarHeight.value
}))

let setViewportObserverInitialised = false

const setViewportObserver = () => {
  if (setViewportObserverInitialised) return
  setViewportObserverInitialised = true

  onMounted(() => {
    const element = document.documentElement
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (!rect) return

      viewport.value.width = rect.width
      viewport.value.height = rect.height
    })

    observer.observe(element)

    onBeforeUnmount(() => observer.disconnect())
  })
}

let setTaskbarObserverInitialised = false

const setTaskbarObserver = (elementRef: Ref<HTMLElement | null>) => {
  if (setTaskbarObserverInitialised) return
  setTaskbarObserverInitialised = true

  onMounted(() => {
    if (!elementRef.value) return

    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height
      if (height === undefined) return
      taskbarHeight.value = height
    })

    observer.observe(elementRef.value)
    onBeforeUnmount(() => observer.disconnect())
  })
}

export const useContentArea = () => {
  return { contentArea, setTaskbarObserver, setViewportObserver }
}
