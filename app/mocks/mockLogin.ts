import { delay } from '~/utils/delay'
import { useMockDbStore } from '~/stores/useMockDbStore'
import type { User } from '~/composables/user/User.d'

export async function mockLogin(email: string, password: string): Promise<User> {
  await delay()
  const db = useMockDbStore()
  return db.loginUser(email, password)
}
