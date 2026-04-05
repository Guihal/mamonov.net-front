import type {
  LessonBrowserEvents,
  LessonMailEvents,
  LessonMessengerEvents,
  LessonConfig
} from '~/types/lesson'
import type { BrowserEvents, MessengerEvents, MailEvents, MessageConfig } from '~/types/programs'
import type { GameControllerContext } from '~/types/game'
import { GAME_CONTROLLER_KEY } from '~/types/game'
import { useMascotStore } from '~/composables/mascot/useMascotStore'
import { useGameOver } from '~/composables/game/useGameOver'
import { useCreateAndRegisterWindow } from '~/components/OS/Window/composables/useCreateAndRegisterWindow'
import { useWifiState } from '~/composables/os/useWifiState'
import { PROGRAMS } from '~/utils/PROGRAMS'

/**
 * Главный игровой контроллер урока.
 *
 * Вызывается ОДИН РАЗ в корневом компоненте страницы урока.
 * Раздаёт контекст вниз через provide/inject.
 */
export function useGameController(config: LessonConfig, totalSteps = Infinity) {
  const userStore = useUserStore()
  const mascotStore = useMascotStore()
  const { triggerGameOver, resetGameOver } = useGameOver()
  const wifiState = useWifiState()

  // ── Игровое состояние ─────────────────────────────────────────────────────
  const step = ref(0)
  const isCompleted = ref(false)
  const isFailed = ref(false)

  // ── Методы ────────────────────────────────────────────────────────────────

  function nextStep() {
    if (isFailed.value || isCompleted.value) return

    mascotStore.clearPhrases()
    step.value += 1

    if (step.value >= totalSteps) {
      complete()
    }
  }

  function goToStep(n: number) {
    if (isFailed.value || isCompleted.value) return
    mascotStore.clearPhrases()
    step.value = n
  }

  async function fail(reason: string) {
    if (isFailed.value || isCompleted.value) return

    isFailed.value = true

    const hitResult = await userStore.hitHp()

    // Если конфиг урока уже поставил реплики — не дублируем
    if (!mascotStore.hasPhrases) {
      mascotStore.setEmotion('sad')
      mascotStore.react(reason, 'sad', 4000)
    }

    triggerGameOver({
      reason,
      isDepleted: hitResult?.isDepleted ?? false,
      categoryId: config.categoryId,
      onRetry: reset
    })
  }

  async function complete() {
    if (isFailed.value || isCompleted.value) return

    isCompleted.value = true

    userStore.markLessonCompleted(config.id, config.categoryId)

    mascotStore.setEmotion('happy')

    triggerGameOver({
      reason: '',
      isDepleted: false,
      isComplete: true,
      categoryId: config.categoryId
    })
  }

  function reset() {
    step.value = 0
    isCompleted.value = false
    isFailed.value = false

    mascotStore.setEmotion('neutral')
    mascotStore.clearPhrases()

    if (config.wifiConfig) {
      wifiState.init(config.wifiConfig)
    }

    resetGameOver()
  }

  // ── Контекст для provide ──────────────────────────────────────────────────

  // openBrowserTab — регистрируется позже (после монтирования браузера).
  // Храним в mutable объекте, чтобы браузер мог подписаться через provide.
  const _openBrowserTabRef = ref<((url: string) => void) | null>(null)

  function openBrowserTab(url: string) {
    _openBrowserTabRef.value?.(url)
  }

  // messengerPushMessage — регистрируется мессенджером при монтировании.
  const _messengerPushMessageRef = ref<((chatId: string, message: MessageConfig) => void) | null>(
    null
  )

  function messengerPushMessage(chatId: string, message: MessageConfig) {
    _messengerPushMessageRef.value?.(chatId, message)
  }

  const ctx: GameControllerContext = {
    step: readonly(step),
    totalSteps,
    isCompleted: readonly(isCompleted),
    isFailed: readonly(isFailed),
    nextStep,
    goToStep,
    openBrowserTab,
    messengerPushMessage,
    wifiConnect: (id: string) => wifiState.connect(id),
    wifiDisconnect: () => wifiState.disconnect(),
    wifiToggleVpn: (enabled?: boolean) => wifiState.toggleVpn(enabled),
    fail,
    complete,
    reset,
    config,
    mascot: mascotStore
  }

  // ── provide ───────────────────────────────────────────────────────────────

  provide(GAME_CONTROLLER_KEY, ctx)
  provide('lessonConfig', config)
  // Браузер при монтировании подпишет свой openTab сюда
  provide('registerOpenBrowserTab', (fn: (url: string) => void) => {
    _openBrowserTabRef.value = fn
  })
  // Мессенджер при монтировании подпишет свой pushMessage сюда
  provide(
    'registerMessengerPushMessage',
    (fn: (chatId: string, message: MessageConfig) => void) => {
      _messengerPushMessageRef.value = fn
    }
  )

  provide('browserEvents', wrapBrowserEvents(config.events?.browser, ctx, isFailed, isCompleted))
  provide(
    'messengerEvents',
    wrapMessengerEvents(config.events?.messenger, ctx, isFailed, isCompleted)
  )
  provide('mailEvents', wrapMailEvents(config.events?.mail, ctx, isFailed, isCompleted))

  provide('messengerChats', config.messengerChats ?? [])
  provide('mailEmails', config.mailEmails ?? [])
  provide('mailFolders', config.mailFolders ?? [])
  provide('browserSites', config.browserSites ?? [])
  provide('browserBookmarks', config.browserBookmarks ?? [])

  // ── Wi-Fi ─────────────────────────────────────────────────────────────────
  if (config.wifiConfig) {
    wifiState.init(config.wifiConfig)
    provide('wifiConfig', config.wifiConfig)
  }

  provide(
    'quickActions',
    (config.quickActions ?? []).map((action) => ({
      ...action,
      onClick: () => {
        if (!isFailed.value && !isCompleted.value) {
          mascotStore.clearPhrases()
          action.onClick(ctx)
        }
      }
    }))
  )

  // ── Инициализация ─────────────────────────────────────────────────────────

  // Открываем окна только для программ из openOnStart (или всех из programs, если не задано)
  const programsToOpen = config.openOnStart ?? config.programs
  for (const programType of programsToOpen) {
    const program = PROGRAMS[programType]
    if (!program) continue
    const startPath = config.startPaths?.[programType] ?? `/${programType}`
    useCreateAndRegisterWindow({
      name: program.label,
      programType,
      path: startPath
    })
  }

  // Передаём startPaths в таскбар, чтобы при клике программы без окон открывался нужный путь
  provide('pinnedStartPaths', config.startPaths ?? {})

  onMounted(async () => {
    await userStore.syncHp(config.categoryId)

    if (userStore.isDepleted) {
      triggerGameOver({ reason: '', isDepleted: true, categoryId: config.categoryId })
      return
    }

    // Автоматическая стартовая реплика из mascotPhrases.greet (если onLessonMounted не задан)
    if (config.mascotPhrases?.greet && !mascotStore.hasPhrases) {
      mascotStore.enqueue({ text: config.mascotPhrases.greet, emotion: 'worried' })
    }
  })

  return ctx
}

// ── Хелперы ──────────────────────────────────────────────────────────────────

function guard(isFailed: Ref<boolean>, isCompleted: Ref<boolean>, fn: () => void) {
  if (!isFailed.value && !isCompleted.value) fn()
}

function wrapBrowserEvents(
  events: LessonBrowserEvents | undefined,
  ctx: GameControllerContext,
  isFailed: Ref<boolean>,
  isCompleted: Ref<boolean>
): BrowserEvents | null {
  if (!events) return null
  return {
    onUrlNavigate: events.onUrlNavigate
      ? (url) => guard(isFailed, isCompleted, () => events.onUrlNavigate!(ctx, url))
      : undefined,
    onFormSubmit: events.onFormSubmit
      ? (url, data) => guard(isFailed, isCompleted, () => events.onFormSubmit!(ctx, url, data))
      : undefined,
    onBookmarkClick: events.onBookmarkClick
      ? (url) => guard(isFailed, isCompleted, () => events.onBookmarkClick!(ctx, url))
      : undefined,
    onTabOpen: events.onTabOpen
      ? (url) => guard(isFailed, isCompleted, () => events.onTabOpen!(ctx, url))
      : undefined,
    onTabClose: events.onTabClose
      ? (url) => guard(isFailed, isCompleted, () => events.onTabClose!(ctx, url))
      : undefined,
    onPopupDownloadClick: events.onPopupDownloadClick
      ? () => guard(isFailed, isCompleted, () => events.onPopupDownloadClick!(ctx))
      : undefined,
    onPopupRemindClick: events.onPopupRemindClick
      ? () => guard(isFailed, isCompleted, () => events.onPopupRemindClick!(ctx))
      : undefined,
    onPopupClose: events.onPopupClose
      ? () => guard(isFailed, isCompleted, () => events.onPopupClose!(ctx))
      : undefined
  }
}

function wrapMessengerEvents(
  events: LessonMessengerEvents | undefined,
  ctx: GameControllerContext,
  isFailed: Ref<boolean>,
  isCompleted: Ref<boolean>
): MessengerEvents | null {
  if (!events) return null
  return {
    onMessageSend: events.onMessageSend
      ? (chatId, text) =>
          guard(isFailed, isCompleted, () => events.onMessageSend!(ctx, chatId, text))
      : undefined,
    onLinkClick: events.onLinkClick
      ? (chatId, url) => guard(isFailed, isCompleted, () => events.onLinkClick!(ctx, chatId, url))
      : undefined,
    onChatOpen: events.onChatOpen
      ? (chatId) => guard(isFailed, isCompleted, () => events.onChatOpen!(ctx, chatId))
      : undefined
  }
}

function wrapMailEvents(
  events: LessonMailEvents | undefined,
  ctx: GameControllerContext,
  isFailed: Ref<boolean>,
  isCompleted: Ref<boolean>
): MailEvents | null {
  if (!events) return null
  return {
    onMailOpen: events.onMailOpen
      ? (emailId) => guard(isFailed, isCompleted, () => events.onMailOpen!(ctx, emailId))
      : undefined,
    onAttachmentOpen: events.onAttachmentOpen
      ? (emailId, attachmentId) =>
          guard(isFailed, isCompleted, () => events.onAttachmentOpen!(ctx, emailId, attachmentId))
      : undefined,
    onLinkClick: events.onLinkClick
      ? (emailId, url) => guard(isFailed, isCompleted, () => events.onLinkClick!(ctx, emailId, url))
      : undefined,
    onReply: events.onReply
      ? (emailId, text) => guard(isFailed, isCompleted, () => events.onReply!(ctx, emailId, text))
      : undefined
  }
}
