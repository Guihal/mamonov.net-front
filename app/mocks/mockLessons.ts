import { delay } from '~/utils/delay'
import { MOCK_LESSONS } from '~/mocks/MOCK_DATA'
import type { Lesson } from '~/lib/api.types'

export async function mockGetLessons(catId: string): Promise<Lesson[]> {
  await delay()
  return MOCK_LESSONS[catId] ?? []
}

export async function mockCompleteLesson(lessonId: string): Promise<{ success: boolean }> {
  await delay()

  for (const lessons of Object.values(MOCK_LESSONS)) {
    const lesson = lessons.find((l) => l.id === lessonId)
    if (lesson) {
      lesson.isCompleted = true
      break
    }
  }

  return { success: true }
}
