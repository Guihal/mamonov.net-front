import type { User } from '~/composables/user/User.d'
import { useUser } from '~/composables/user/useUser'
import { mockRegister } from '~/mocks/mockRegister'

export const useRegister = () => {
  const store = useUser()
  const config = useRuntimeConfig()
  const isBattleApi = config.public.isBattleApi

  const pending = ref(false)
  const error = ref<Error | null>(null)

  const register = async (name: string, email: string, password: string): Promise<User | null> => {
    pending.value = true
    error.value = null

    console.log('[useRegister] Начало регистрации', { name, email, isBattleApi })

    try {
      let user: User

      if (isBattleApi) {
        user = await $fetch<User>('/auth/register', {
          method: 'POST',
          body: { name, email, password },
          credentials: 'include'
        })
        console.log('[useRegister] Боевая регистрация успешна', { email: user.email, name: user.name })
      } else {
        user = await mockRegister(name, email, password)
        console.log('[useRegister] Мок-регистрация успешна', { email: user.email, name: user.name })
      }

      if (!user) {
        throw new Error('Что-то пошло не так при регистрации')
      }

      store.setUser(user)
      console.log('[useRegister] Пользователь установлен в стор')

      await navigateTo('/app')
      return user
    } catch (e) {
      const err = e as Error
      error.value = err
      console.error('[useRegister] Ошибка регистрации', err)
      return null
    } finally {
      pending.value = false
    }
  }

  return { register, pending, error }
}
