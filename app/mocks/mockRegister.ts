import { MOCK_USER } from '~/mocks/MOCK_USER'
import { delay } from '~/utils/delay'
import type { User } from '~/composables/user/User.d'

export async function mockRegister(name: string, email: string, password: string): Promise<User> {
  await delay()

  return {
    ...MOCK_USER,
    name,
    email
  }
}
