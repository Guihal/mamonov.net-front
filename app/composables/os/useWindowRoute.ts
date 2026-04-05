import { useOsIsolated } from './useOsIsolated'

export function useWindowRoute() {
  const { isIsolated } = useOsIsolated()
  const { queuedPush } = useQueuedRouter()
  const { allWindows } = useAllWindows()

  const navigateWindow = (windowId: string, path: string) => {
    const window = allWindows.value[windowId]
    if (!window) return

    window.targetFile.value = path

    if (!isIsolated.value) {
      queuedPush(path)
    }
  }

  return { navigateWindow }
}
