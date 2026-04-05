import { useUser } from '~/composables/user/useUser'
import type { User } from '~/composables/user/User'

export default defineNuxtPlugin(async () => {
  const store = useUser()
  const config = useRuntimeConfig()
  const isBattleApi = config.public.isBattleApi

  if (store.isAurhorized) return

  // Mock-режим: localStorage доступен только на клиенте
  if (!isBattleApi) {
    if (import.meta.client) {
      const { useMockDbStore } = await import('~/stores/useMockDbStore')
      const db = useMockDbStore()
      const user = db.getCurrentUser()
      if (user) {
        store.setUser({ email: user.email, name: user.name })
      }
    }
    return
  }

  // Battle-режим: запрос к API с форвардингом куки
  const baseUrl = import.meta.server ? config.apiBaseUrl : ''
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  const fetchUser = () =>
    $fetch<User>(`${baseUrl}/auth/current_user`, {
      credentials: 'include',
      headers
    })

  const tryRefresh = () =>
    $fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers
    })

  try {
    const user = await fetchUser()
    store.setUser(user)
  } catch (e: unknown) {
    const is401 =
      e !== null &&
      typeof e === 'object' &&
      'status' in e &&
      (e as { status: number }).status === 401

    if (!is401) return

    try {
      await tryRefresh()
      const user = await fetchUser()
      store.setUser(user)
    } catch {
      // Сессия истекла — middleware перенаправит на логин
    }
  }
})
