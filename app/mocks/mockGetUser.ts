import { MOCK_USER } from '~/mocks/MOCK_USER'
import { delay } from '~/utils/delay'

export async function mockGetUser() {
  await delay()
  return MOCK_USER
}
