import type { ChatConfig, MessageConfig, MessengerEvents } from '~/types/programs'

const BASE_CHATS: ChatConfig[] = [
  {
    id: 'work-chat',
    name: 'Рабочий чатик',
    avatar: undefined,
    isGroupChat: true,
    messages: [
      {
        id: 'work-1',
        sender: 'Анна Петрова',
        text: 'Всем привет! Напоминаю про созвон в 15:00',
        timestamp: '2026-04-03T14:30:00',
        isOwn: false
      },
      {
        id: 'work-2',
        sender: 'Дмитрий Козлов',
        text: 'Принято, буду!',
        timestamp: '2026-04-03T14:32:00',
        isOwn: false
      }
    ]
  },
  {
    id: 'general',
    name: 'Общий',
    avatar: undefined,
    isGroupChat: true,
    messages: [
      {
        id: 'gen-1',
        sender: 'Бот',
        text: 'Добро пожаловать в корпоративный мессенджер!',
        timestamp: '2026-04-01T08:00:00',
        isOwn: false
      },
      {
        id: 'gen-2',
        sender: 'Мария Сидорова',
        text: 'Кто-нибудь знает Wi-Fi пароль для переговорки 3?',
        timestamp: '2026-04-02T11:15:00',
        isOwn: false
      }
    ]
  },
  {
    id: 'hr',
    name: 'HR отдел',
    avatar: undefined,
    isGroupChat: false,
    messages: [
      {
        id: 'hr-1',
        sender: 'HR отдел',
        text: 'Напоминаем: завтра последний день подачи заявления на отпуск на май.',
        timestamp: '2026-04-03T09:00:00',
        isOwn: false
      }
    ]
  }
]

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function useMessengerState(events?: MessengerEvents) {
  const chats = ref<ChatConfig[]>(deepClone(BASE_CHATS))

  const activeChatId = ref<string | null>(null)

  const activeChat = computed<ChatConfig | null>(() =>
    activeChatId.value ? (chats.value.find((c) => c.id === activeChatId.value) ?? null) : null
  )

  const selectChat = (chatId: string) => {
    activeChatId.value = chatId
    events?.onChatOpen?.(chatId)
  }

  const sendMessage = (text: string) => {
    if (!activeChatId.value || !text.trim()) return
    const chat = chats.value.find((c) => c.id === activeChatId.value)
    if (!chat) return
    const msg: MessageConfig = {
      id: `own-${Date.now()}`,
      sender: 'Я',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isOwn: true
    }
    chat.messages.push(msg)
    events?.onMessageSend?.(activeChatId.value, text.trim())
  }

  const pushMessage = (chatId: string, message: MessageConfig) => {
    const chat = chats.value.find((c) => c.id === chatId)
    if (!chat) {
      console.warn('[useMessengerState] pushMessage: чат не найден', chatId)
      return
    }
    chat.messages.push(deepClone(message))
  }

  const addChats = (newChats: ChatConfig[]) => {
    for (const chat of newChats) {
      const existingIndex = chats.value.findIndex((c) => c.id === chat.id)
      if (existingIndex !== -1) {
        chats.value[existingIndex] = deepClone(chat)
      } else {
        chats.value.push(deepClone(chat))
      }
    }
  }

  const handleLinkClick = (url: string) => {
    if (!activeChatId.value) return
    events?.onLinkClick?.(activeChatId.value, url)
  }

  const getLastMessage = (chatId: string): MessageConfig | null => {
    const chat = chats.value.find((c) => c.id === chatId)
    if (!chat || chat.messages.length === 0) return null
    return chat.messages[chat.messages.length - 1] ?? null
  }

  return {
    chats,
    activeChatId: readonly(activeChatId),
    activeChat,
    selectChat,
    sendMessage,
    pushMessage,
    addChats,
    handleLinkClick,
    getLastMessage
  }
}
