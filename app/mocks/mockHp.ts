import { delay } from '~/utils/delay'
import { MOCK_HP } from '~/mocks/MOCK_DATA'
import type { HpState, HpHitResponse } from '~/lib/api.types'

export async function mockGetHp(catId: string): Promise<HpState> {
  await delay()
  return MOCK_HP[catId] ?? { current: 10, max: 10 }
}

export async function mockHitHp(categoryId: string): Promise<HpHitResponse> {
  await delay()

  const hp = MOCK_HP[categoryId] ?? { current: 10, max: 10 }
  const current = Math.max(0, hp.current - 1)
  const isDepleted = current === 0

  MOCK_HP[categoryId] = { ...hp, current }

  return { current, max: hp.max, isDepleted }
}
