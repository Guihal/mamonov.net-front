import type { NitroFetchOptions } from 'nitropack'

type FetchOpts = NitroFetchOptions<string>

interface UseApiFetchOptions extends FetchOpts {
  protected?: boolean
}

async function refreshAndRetry<T>(url: string, opts: FetchOpts): Promise<T> {
  try {
    await $fetch('/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    })

    const response = await $fetch<T>(url, {
      ...opts,
      credentials: 'include'
    })
    return response
  } catch {
    await navigateTo('/app/auth/login')
    throw new Error('Сессия истекла. Войдите заново.')
  }
}

export function useApiFetch<T>(url: string | (() => string), options: UseApiFetchOptions = {}) {
  const { protected: isProtected, ...fetchOpts } = options

  const urlStr = typeof url === 'function' ? url() : url
  const $fetchOpts: FetchOpts = { ...fetchOpts, credentials: 'include' }

  return useAsyncData<T>(
    urlStr,
    async () => {
      try {
        const response = await $fetch<T>(urlStr, $fetchOpts)
        return response
      } catch (e: unknown) {
        const isUnauthorized =
          isProtected &&
          e instanceof Error &&
          'status' in e &&
          (e as Error & { status: number }).status === 401
        if (isUnauthorized) {
          return await refreshAndRetry<T>(urlStr, $fetchOpts)
        }
        throw e
      }
    },
    { server: false }
  )
}
