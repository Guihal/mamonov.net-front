import { useUser } from '~/composables/user/useUser'
import { useLogin } from '~/composables/auth/useLogin'
import { useRegister } from '~/composables/auth/useRegister'

export const useAuth = () => {
  const store = useUser()
  const { login, pending: loginPending, error: loginError } = useLogin()
  const { register, pending: registerPending, error: registerError } = useRegister()

  const isAuthorized = computed(() => store.isAurhorized)
  const user = computed(() => store.user)
  const pending = computed(() => loginPending.value || registerPending.value)
  const error = computed(() => loginError.value || registerError.value)

  const logout = async () => {
    console.log('[useAuth] Выход пользователя')
    store.unauthorize()
    await navigateTo('/app/auth/login')
  }

  return {
    isAuthorized,
    user,
    login,
    register,
    logout,
    pending,
    error
  }
}
