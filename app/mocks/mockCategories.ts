import { delay } from '~/utils/delay'
import { MOCK_CATEGORIES } from '~/mocks/MOCK_DATA'
import type { Category } from '~/lib/api.types'

export async function mockGetCategories(): Promise<Category[]> {
  await delay()
  return MOCK_CATEGORIES
}
