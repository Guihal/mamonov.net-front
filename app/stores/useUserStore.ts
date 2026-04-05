import type { HpHitResponse, LessonProgress } from '~/lib/api.types'
import * as api from '~/lib/api.methods'
import { useMockDbStore } from '~/stores/useMockDbStore'

export const useUserStore = defineStore('userGame', () => {
  const config = useRuntimeConfig()
  const isBattleApi = config.public.isBattleApi

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
      if (isBattleApi) {
        const data = await api.getHp(categoryId)
        hp.value = data.current
        maxHp.value = data.max
        restoredAt.value = data.restoredAt
      } else {
        const db = useMockDbStore()
        const data = db.getHp(categoryId)
        hp.value = data.current
        maxHp.value = data.max
        restoredAt.value = data.restoredAt
      }
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
      if (isBattleApi) {
        const data = await api.hitHp(catId)
        hp.value = data.current
        maxHp.value = data.max
        if (data.isDepleted) {
          restoredAt.value = new Date(Date.now() + 30 * 60_000).toISOString()
        }
        return data
      } else {
        const db = useMockDbStore()
        const data = db.hitHp(catId)
        hp.value = data.current
        maxHp.value = data.max
        if (data.isDepleted) {
          restoredAt.value = new Date(Date.now() + 30 * 60_000).toISOString()
        }
        return data
      }
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
      if (isBattleApi) {
        progress.value = await api.getProgress()
      } else {
        const db = useMockDbStore()
        progress.value = db.getProgress()
      }
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
   * Отметить урок как завершённый.
   * При isBattleApi — вызывает POST /lessons/:id/complete на сервер.
   */
  async function markLessonCompleted(lessonId: string, categoryId: string) {
    if (isLessonCompleted(lessonId)) return
    progress.value.push({
      lessonId,
      categoryId,
      completedAt: new Date().toISOString(),
      attempts: 1
    })

    if (isBattleApi) {
      try {
        await api.completeLesson(lessonId)
      } catch (e) {
        console.error('[useUserStore] markLessonCompleted API call failed:', e)
      }
    } else {
      const db = useMockDbStore()
      db.completeLesson(lessonId)
    }
  }

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
