export type MascotEmotion = 'neutral' | 'happy' | 'worried' | 'sad'

/** Входные данные реплики (без id — генерируется стором). */
export interface MascotPhraseInput {
  /** Текст пузыря. Если не задан — пузырь не рисуется (только смена эмоции / пауза). */
  text?: string
  /** Эмоция маскота. Если задана — сменится когда реплика станет текущей. По умолчанию — текущая. */
  emotion?: MascotEmotion
  /** Авто-dismiss через N мс. Если не задан — ждём клика пользователя. */
  delay?: number
  /** Вызывается сразу после того, как реплика убрана (по клику или по таймеру). */
  onAfterDismiss?: () => void
}

/** Реплика в очереди (с id). */
export interface MascotPhrase extends MascotPhraseInput {
  id: string
}
