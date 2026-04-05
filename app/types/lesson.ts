import type { ProgramType } from '~~/shared/types/Program'
import type {
  BrowserSiteConfig,
  BookmarkConfig,
  ChatConfig,
  EmailConfig,
  MailFolder
} from './programs'
import type { WifiConfig } from './wifi'
import type { MascotPhraseKey } from '~/utils/constants/MASCOT_PHRASES'
import type { GameControllerContext } from './game'

export interface ComicSlide {
  src: string
}

export interface QuickAction {
  id: string
  icon: string
  label: string
  /** Шаги, на которых показывается action. Если не задано — показывается всегда. */
  visibleOnSteps?: number[]
  onClick: (ctrl: GameControllerContext) => void
}

// ── Lesson-level event types (ctrl is first arg) ──────────────────────────────

export interface LessonBrowserEvents {
  onUrlNavigate?: (ctrl: GameControllerContext, url: string) => void
  onFormSubmit?: (ctrl: GameControllerContext, url: string, data: Record<string, string>) => void
  onBookmarkClick?: (ctrl: GameControllerContext, url: string) => void
  onTabOpen?: (ctrl: GameControllerContext, url: string) => void
  onTabClose?: (ctrl: GameControllerContext, url: string) => void
  onPopupDownloadClick?: (ctrl: GameControllerContext) => void
  onPopupRemindClick?: (ctrl: GameControllerContext) => void
  onPopupClose?: (ctrl: GameControllerContext) => void
}

export interface LessonMessengerEvents {
  onMessageSend?: (ctrl: GameControllerContext, chatId: string, text: string) => void
  onLinkClick?: (ctrl: GameControllerContext, chatId: string, url: string) => void
  onChatOpen?: (ctrl: GameControllerContext, chatId: string) => void
}

export interface LessonMailEvents {
  onMailOpen?: (ctrl: GameControllerContext, emailId: string) => void
  onAttachmentOpen?: (ctrl: GameControllerContext, emailId: string, attachmentId: string) => void
  onLinkClick?: (ctrl: GameControllerContext, emailId: string, url: string) => void
  onReply?: (ctrl: GameControllerContext, emailId: string, text: string) => void
}

export interface LessonEvents {
  browser?: LessonBrowserEvents
  messenger?: LessonMessengerEvents
  mail?: LessonMailEvents
}

export interface LessonConfig {
  id: string
  categoryId: string
  comic?: ComicSlide[]
  /** Все программы урока (pinned в таскбаре + доступные для открытия). */
  programs: ProgramType[]
  /**
   * Программы, которые открываются окнами при старте урока.
   * Если не задано — открываются все из `programs`.
   */
  openOnStart?: ProgramType[]
  /**
   * Стартовые пути окон при открытии программы из таскбара (и при инициализации).
   * Например: { browser: '/browser/news-daily.ru' }
   */
  startPaths?: Partial<Record<ProgramType, string>>
  quickActions?: QuickAction[]
  mascotPhrases?: Partial<Record<MascotPhraseKey, string>>

  browserSites?: BrowserSiteConfig[]
  browserBookmarks?: BookmarkConfig[]
  messengerChats?: ChatConfig[]
  /** ID чата, который открывается автоматически при старте мессенджера. */
  messengerOpenChatId?: string
  mailEmails?: EmailConfig[]
  mailFolders?: MailFolder[]

  /** Конфигурация Wi-Fi трея (если задана — показывается иконка Wi-Fi в таскбаре). */
  wifiConfig?: WifiConfig

  events?: LessonEvents
}
