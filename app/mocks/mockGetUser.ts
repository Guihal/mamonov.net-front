import { delay } from '~/utils/delay'
import { useMockDbStore } from '~/stores/useMockDbStore'
import type { User } from '~/composables/user/User.d'

export async function mockGetUser(): Promise<User | null> {
  await delay()
  const db = useMockDbStore()
  return db.getCurrentUser()
}
