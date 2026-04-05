import type { HpHitResponse, LessonProgress } from '~/lib/api.types'
import { useMockDbStore } from '~/stores/useMockDbStore'

export const useUserStore = defineStore('userGame', () => {
  // ── State ──
  const hp = ref(3)
  const maxHp = ref(3)
  const restoredAt = ref<string | null>(null)
  const progress = ref<LessonProgress[]>([])
  const currentCategoryId = ref<string | null>(null)
  const _tick = ref(0)

  // ── Getters ──
  const isDepleted = computed(() => hp.value <= 0)

  const hpPercent = computed(() =>
    maxHp.value > 0 ? Math.round((hp.value / maxHp.value) * 100) : 0
  )

  const restoredAtDate = computed(() => (restoredAt.value ? new Date(restoredAt.value) : null))

  const timeUntilRestore = computed(() => {
    void _tick.value
    if (!restoredAtDate.value) return null
    const diff = restoredAtDate.value.getTime() - Date.now()
    return diff > 0 ? diff : null
  })

  // ── Actions ──

  /**
   * Синхронизировать HP с сервером.
   * Вызывать при входе на страницу урока.
   */
  async function syncHp(categoryId: string) {
    currentCategoryId.value = categoryId
    try {
      // TODO: заменить на реальный API
      const db = useMockDbStore()
      const data = db.getHp(categoryId)
      hp.value = data.current
      maxHp.value = data.max
      restoredAt.value = data.restoredAt
    } catch (e) {
      console.error('[useUserStore] syncHp failed:', e)
    }
  }

  /**
   * Отправить хит HP на сервер.
   * Вызывается из gameController.fail().
   * Возвращает ответ сервера для дальнейшей обработки (GameOver).
   */
  async function hitHp(): Promise<HpHitResponse | null> {
    const catId = currentCategoryId.value
    if (!catId) {
      console.warn('[useUserStore] hitHp: currentCategoryId not set')
      return null
    }
    try {
      // TODO: заменить на реальный API
      const db = useMockDbStore()
      const data = db.hitHp(catId)
      hp.value = data.current
      maxHp.value = data.max
      if (data.isDepleted) {
        restoredAt.value = new Date(Date.now() + 30 * 60_000).toISOString()
      }
      return data
    } catch (e) {
      console.error('[useUserStore] hitHp failed:', e)
      return null
    }
  }

  /**
   * Загрузить прогресс пользователя.
   */
  async function syncProgress() {
    try {
      // TODO: заменить на реальный API
      const db = useMockDbStore()
      progress.value = db.getProgress()
    } catch (e) {
      console.error('[useUserStore] syncProgress failed:', e)
    }
  }

  /**
   * Проверить, пройден ли урок.
   */
  function isLessonCompleted(lessonId: string): boolean {
    return progress.value.some((p) => p.lessonId === lessonId)
  }

  /**
   * Добавить урок в прогресс (локально, после POST /lessons/:id/complete).
   */
  function markLessonCompleted(lessonId: string, categoryId: string) {
    if (isLessonCompleted(lessonId)) return
    progress.value.push({
      lessonId,
      categoryId,
      completedAt: new Date().toISOString(),
      attempts: 1
    })
  }

  /**
   * Сброс стора (при логауте или смене пользователя).
   */
  function tickTimer() {
    _tick.value++
  }

  function $reset() {
    hp.value = 3
    maxHp.value = 3
    restoredAt.value = null
    progress.value = []
    currentCategoryId.value = null
    _tick.value = 0
  }

  return {
    // state
    hp,
    maxHp,
    restoredAt,
    progress,
    currentCategoryId,
    // getters
    isDepleted,
    hpPercent,
    restoredAtDate,
    timeUntilRestore,
    // actions
    syncHp,
    hitHp,
    syncProgress,
    isLessonCompleted,
    markLessonCompleted,
    tickTimer,
    $reset
  }
})
