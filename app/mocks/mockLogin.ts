import { MOCK_USER } from '~/mocks/MOCK_USER'
import { delay } from '~/utils/delay'

export async function mockLogin(email: string, password: string) {
  await delay()
  return MOCK_USER
}
