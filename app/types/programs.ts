import type { Component } from 'vue'

// --- Explorer ---

export interface FolderConfig {
  name: string
  children: (FolderConfig | FileEntryConfig)[]
}

export interface FileEntryConfig {
  name: string
  icon?: string
  isMalicious?: boolean
  onOpen?: () => void
}

export interface ExplorerEvents {
  onFileOpen?: (path: string, file: FileEntryConfig) => void
  onFolderOpen?: (path: string) => void
}

export interface ExplorerConfig {
  rootFolder?: FolderConfig
  events?: ExplorerEvents
}

// --- Browser ---

export interface BrowserSiteConfig {
  url: string
  title: string
  component: Component
  favicon?: string
}

export interface BookmarkConfig {
  label: string
  url: string
  favicon?: string
  icon?: string
}

export interface BrowserEvents {
  onUrlNavigate?: (url: string) => void
  onFormSubmit?: (url: string, data: Record<string, string>) => void
  onBookmarkClick?: (url: string) => void
  onTabOpen?: (url: string) => void
  onTabClose?: (url: string) => void
  onPopupDownloadClick?: () => void
  onPopupRemindClick?: () => void
  onPopupClose?: () => void
}

// --- Messenger ---

export interface ChatConfig {
  id: string
  name: string
  avatar?: string
  messages: MessageConfig[]
  isGroupChat?: boolean
}

export interface MessageConfig {
  id: string
  sender: string
  senderAvatar?: string
  text: string
  timestamp?: string
  isOwn?: boolean
}

export interface MessengerEvents {
  onMessageSend?: (chatId: string, text: string) => void
  onLinkClick?: (chatId: string, url: string) => void
  onChatOpen?: (chatId: string) => void
}

// --- Mail ---

export interface MailFolder {
  id: string
  name: string
  icon?: string
}

export interface EmailConfig {
  id: string
  folder: string
  from: string
  fromEmail: string
  to?: string
  subject: string
  body: string
  date: string
  isRead?: boolean
  attachments?: AttachmentConfig[]
}

export interface AttachmentConfig {
  id: string
  name: string
  icon?: string
  isMalicious?: boolean
}

export interface MailEvents {
  onMailOpen?: (emailId: string) => void
  onAttachmentOpen?: (emailId: string, attachmentId: string) => void
  onLinkClick?: (emailId: string, url: string) => void
  onReply?: (emailId: string, text: string) => void
}
