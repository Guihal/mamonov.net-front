import type { User } from '~/composables/user/User.d'
import { useUser } from '~/composables/user/useUser'
import { mockLogin } from '~/mocks/mockLogin'

export const useLogin = () => {
  const store = useUser()
  const config = useRuntimeConfig()
  const isBattleApi = config.public.isBattleApi

  const pending = ref(false)
  const error = ref<Error | null>(null)

  const login = async (email: string, password: string): Promise<User | null> => {
    pending.value = true
    error.value = null

    console.log('[useLogin] Начало логина', { email, isBattleApi })

    try {
      let user: User
      console.log(isBattleApi)
      if (isBattleApi) {
        user = await $fetch<User>('/auth/login', {
          method: 'POST',
          body: { email, password },
          credentials: 'include'
        })
        console.log('[useLogin] Боевой логин успешен', { email: user.email, name: user.name })
      } else {
        user = await mockLogin(email, password)
        console.log('[useLogin] Мок-логин успешен', { email: user.email, name: user.name })
      }

      if (!user) {
        throw new Error('Что-то пошло не так при логине')
      }

      store.setUser(user)
      console.log('[useLogin] Пользователь установлен в стор')

      await navigateTo('/app')
      return user
    } catch (e) {
      const err = e as Error
      error.value = err
      console.error('[useLogin] Ошибка логина', err)
      return null
    } finally {
      pending.value = false
    }
  }

  return { login, pending, error }
}
