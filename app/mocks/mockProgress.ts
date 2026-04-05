import { delay } from '~/utils/delay'
import type { LessonProgress } from '~/lib/api.types'

const MOCK_PROGRESS: LessonProgress[] = [
  {
    lessonId: 'phishing-1',
    categoryId: 'phishing',
    completedAt: '2026-03-20T10:00:00Z',
    attempts: 1
  },
  {
    lessonId: 'phishing-2',
    categoryId: 'phishing',
    completedAt: '2026-03-21T14:30:00Z',
    attempts: 2
  },
  {
    lessonId: 'passwords-1',
    categoryId: 'passwords',
    completedAt: '2026-03-22T09:15:00Z',
    attempts: 1
  }
]

export async function mockGetProgress(): Promise<LessonProgress[]> {
  await delay()
  return [...MOCK_PROGRESS]
}
