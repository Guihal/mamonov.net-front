import type { MascotEmotion, MascotPhraseInput, MascotPhrase } from '~/types/mascot'

export const useMascotStore = defineStore('mascot', () => {
  // ── State ──
  const currentEmotion = ref<MascotEmotion>('neutral')
  const phrases = ref<MascotPhrase[]>([])
  const isVisible = ref(true)

  let _dismissTimer: ReturnType<typeof setTimeout> | null = null

  // ── Getters ──

  const currentPhrase = computed<MascotPhrase | null>(() => phrases.value[0] ?? null)
  const hasPhrases = computed(() => phrases.value.length > 0)
  const hasText = computed(() => !!currentPhrase.value?.text)

  // ── Actions ──

  /**
   * Добавить одну или несколько реплик в очередь.
   * Если очередь была пуста — сразу активирует первую.
   */
  function enqueue(items: MascotPhraseInput | MascotPhraseInput[]) {
    const arr = Array.isArray(items) ? items : [items]
    const wasEmpty = phrases.value.length === 0

    for (const input of arr) {
      phrases.value.push({
        ...input,
        id: `phrase-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      })
    }

    if (wasEmpty) {
      _activateCurrent()
    }
  }

  /**
   * Убрать текущую реплику. Следующая в очереди становится текущей.
   */
  function dismissPhrase() {
    _clearDismissTimer()
    const phrase = phrases.value[0]
    phrases.value.shift()
    phrase?.onAfterDismiss?.()
    _activateCurrent()
  }

  /**
   * Очистить все реплики.
   */
  function clearPhrases() {
    _clearDismissTimer()
    phrases.value = []
  }

  /**
   * Сменить эмоцию напрямую (без очереди).
   */
  function setEmotion(emotion: MascotEmotion) {
    currentEmotion.value = emotion
  }

  /**
   * Показать/скрыть маскота.
   */
  function setVisible(visible: boolean) {
    isVisible.value = visible
  }

  /**
   * Удобный шортхенд: одна реплика с текстом + эмоция + авто-dismiss.
   */
  function react(text: string, emotion: MascotEmotion, delay = 3000) {
    enqueue({ text, emotion, delay })
  }

  /**
   * Полный сброс (при выходе из урока).
   */
  function $reset() {
    _clearDismissTimer()
    currentEmotion.value = 'neutral'
    phrases.value = []
    isVisible.value = true
  }

  // ── Internal ──

  /**
   * Активировать текущую (первую) реплику:
   * — применить emotion если есть
   * — если нет text и нет delay → сразу перейти к следующей
   * — если есть delay → запустить таймер
   * — если нет delay → ждём клика (ничего не делаем)
   */
  function _activateCurrent() {
    const phrase = phrases.value[0]
    if (!phrase) return

    // Применить эмоцию
    if (phrase.emotion) {
      currentEmotion.value = phrase.emotion
    }

    // Без текста и без delay — мгновенный переход (только смена эмоции)
    if (!phrase.text && !phrase.delay) {
      phrases.value.shift()
      _activateCurrent()
      return
    }

    // Авто-dismiss по таймеру
    if (phrase.delay) {
      _startDismissTimer(phrase.delay)
    }
    // Без delay → ждём клика (dismissPhrase вызовется из компонента)
  }

  function _startDismissTimer(ms: number) {
    _clearDismissTimer()
    _dismissTimer = setTimeout(() => {
      dismissPhrase()
    }, ms)
  }

  function _clearDismissTimer() {
    if (_dismissTimer) {
      clearTimeout(_dismissTimer)
      _dismissTimer = null
    }
  }

  return {
    // state
    currentEmotion,
    phrases,
    isVisible,
    // getters
    currentPhrase,
    hasPhrases,
    hasText,
    // actions
    enqueue,
    dismissPhrase,
    clearPhrases,
    setEmotion,
    setVisible,
    react,
    $reset
  }
})
