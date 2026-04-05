import { useAllWindows, type AllWindows } from './useAllWindows'

export const useWindowPaths = () => {
  const { allWindows } = useAllWindows()

  const hasPath = (path: string) => {
    for (const key in allWindows.value) {
      const typedKey = key as keyof AllWindows
      if (allWindows!.value[typedKey]!.targetFile.value === path)
        return allWindows!.value[typedKey]!.id
    }

    return false
  }

  return { hasPath }
}
