import type { User } from '~/composables/user/User'

export const useUser = defineStore('user', () => {
  const user = ref<User | null>(null)

  const isAurhorized = computed(() => user.value !== null)
  const setUser = (u: User | null) => {
    user.value = u
  }
  const unauthorize = () => {
    user.value = null
  }

  return {
    user,
    isAurhorized,
    setUser,
    unauthorize
  }
})
