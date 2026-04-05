const isIsolated = ref(false)

export function useOsIsolated() {
  const setIsolated = (value: boolean) => {
    isIsolated.value = value
  }

  return { isIsolated: readonly(isIsolated), setIsolated }
}
