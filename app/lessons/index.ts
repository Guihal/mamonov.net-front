import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'
import { fakeUpdateConfig, onLessonMounted as fakeUpdateMounted } from './home-fake-update/config'

export const LESSON_CONFIGS: Record<string, LessonConfig> = {
  'home-fake-update': fakeUpdateConfig
}

/** Колбэк onMounted конкретного урока (стартовые реплики маскота, сброс стейта). */
export const LESSON_ON_MOUNTED: Record<
  string,
  (mascot: { enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void }) => void
> = {
  'home-fake-update': fakeUpdateMounted
}
