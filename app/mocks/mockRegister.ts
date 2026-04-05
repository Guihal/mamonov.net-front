import { delay } from '~/utils/delay'
import { useMockDbStore } from '~/stores/useMockDbStore'
import type { User } from '~/composables/user/User.d'

export async function mockRegister(name: string, email: string, password: string): Promise<User> {
  await delay()
  const db = useMockDbStore()
  return db.registerUser(name, email, password)
}
