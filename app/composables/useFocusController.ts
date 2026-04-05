import type { WindowOb } from '~/components/OS/Window/Window'

export const focusedWindowId: Ref<null | string> = ref(null)

export function useFocusWindowController() {
  const { allWindows } = useAllWindows()
  const { queuedPush } = useQueuedRouter()

  const unFocus = () => {
    focusedWindowId.value = null
    queuedPush('/')
  }

  const focus = (idWindow: string) => {
    if (focusedWindowId.value === idWindow) return
    focusedWindowId.value = idWindow
  }

  const getIsFocusedState = (windowOb: WindowOb) => {
    return computed(() => windowOb.id === focusedWindowId.value)
  }

  return { focus, unFocus, getIsFocusedState }
}
