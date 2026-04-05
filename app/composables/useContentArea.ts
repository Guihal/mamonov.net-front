const viewport = ref({
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0
})

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

let viewportObserver: ResizeObserver | null = null

const setViewportObserver = () => {
  if (viewportObserver) return

  onMounted(() => {
    const element = document.documentElement
    if (!element) return

    viewportObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (!rect) return

      viewport.value.width = rect.width
      viewport.value.height = rect.height
    })

    viewportObserver.observe(element)

    onBeforeUnmount(() => {
      viewportObserver?.disconnect()
      viewportObserver = null
    })
  })
}

let taskbarObserver: ResizeObserver | null = null

const setTaskbarObserver = (elementRef: Ref<HTMLElement | null>) => {
  if (taskbarObserver) return

  onMounted(() => {
    if (!elementRef.value) return

    taskbarObserver = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height
      if (height === undefined) return
      taskbarHeight.value = height
    })

    taskbarObserver.observe(elementRef.value)
    onBeforeUnmount(() => {
      taskbarObserver?.disconnect()
      taskbarObserver = null
    })
  })
}

export const useContentArea = () => {
  return { contentArea, setTaskbarObserver, setViewportObserver }
}
