import type { InjectionKey, Ref } from 'vue'
import type { LessonConfig } from './lesson'
import type { MessageConfig } from './programs'
import type { useMascotStore } from '~/composables/mascot/useMascotStore'

export interface GameControllerContext {
  /** Текущий шаг урока (0-based). Реактивный ref. */
  step: Readonly<Ref<number>>
  /** Сколько шагов всего. */
  totalSteps: number
  /** Урок завершён (правильно). */
  isCompleted: Readonly<Ref<boolean>>
  /** Заблокирован: game over показан. */
  isFailed: Readonly<Ref<boolean>>
  /** Перейти к следующему шагу. Если это последний — вызывает complete(). */
  nextStep: () => void
  /** Перепрыгнуть к конкретному шагу (без complete-проверки). */
  goToStep: (n: number) => void
  /** Открыть новую вкладку в браузере (если браузер открыт). */
  openBrowserTab: (url: string) => void
  /** Отправить сообщение в мессенджер (от NPC). */
  messengerPushMessage: (chatId: string, message: MessageConfig) => void
  /** Подключиться к Wi-Fi сети (по id). */
  wifiConnect: (networkId: string) => void
  /** Отключиться от Wi-Fi. */
  wifiDisconnect: () => void
  /** Включить/выключить VPN. */
  wifiToggleVpn: (enabled?: boolean) => void
  /** Пользователь совершил ошибку. */
  fail: (reason: string) => void
  /** Принудительно завершить урок (правильно). */
  complete: () => void
  /** Сброс всего состояния (для кнопки «Попробовать снова»). */
  reset: () => void
  /** Конфиг урока (read-only). */
  config: LessonConfig
  /** Маскот-стор для управления репликами из config-колбэков. */
  mascot: ReturnType<typeof useMascotStore>
}

export const GAME_CONTROLLER_KEY: InjectionKey<GameControllerContext> = Symbol('gameController')

export interface GameOverPayload {
  reason: string
  isDepleted: boolean
  isComplete?: boolean
  categoryId: string
  onRetry?: () => void
}
