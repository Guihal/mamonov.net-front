import { delay } from '~/utils/delay'
import { MOCK_HP } from '~/mocks/MOCK_DATA'
import type { HpState, HpHitResponse, HpStateExtended } from '~/lib/api.types'

export async function mockGetHp(catId: string): Promise<HpState> {
  await delay()
  return MOCK_HP[catId] ?? { current: 10, max: 10 }
}

export async function mockGetHpExtended(categoryId: string): Promise<HpStateExtended> {
  await delay()
  const hp = MOCK_HP[categoryId] ?? { current: 3, max: 3 }
  return {
    ...hp,
    isDepleted: hp.current <= 0,
    restoredAt: hp.current <= 0 ? new Date(Date.now() + 30 * 60_000).toISOString() : null
  }
}

export async function mockHitHp(categoryId: string): Promise<HpHitResponse> {
  await delay()

  const hp = MOCK_HP[categoryId] ?? { current: 10, max: 10 }
  const current = Math.max(0, hp.current - 1)
  const isDepleted = current === 0

  MOCK_HP[categoryId] = { ...hp, current }

  return { current, max: hp.max, isDepleted }
}
