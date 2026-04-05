import type { MailFolder, EmailConfig, MailEvents } from '~/types/programs'

const BASE_FOLDERS: MailFolder[] = [
  { id: 'inbox', name: 'Входящие', icon: 'i-lucide-inbox' },
  { id: 'sent', name: 'Отправленные', icon: 'i-lucide-send' },
  { id: 'spam', name: 'Спам', icon: 'i-lucide-alert-triangle' },
  { id: 'trash', name: 'Корзина', icon: 'i-lucide-trash-2' }
]

const BASE_EMAILS: EmailConfig[] = [
  {
    id: 'base-1',
    folder: 'inbox',
    from: 'HR отдел',
    fromEmail: 'hr@company.local',
    subject: 'Обновление политики паролей',
    body: `<p>Уважаемые коллеги!</p>
<p>Напоминаем, что с 1 числа следующего месяца вступает в силу обновлённая политика паролей:</p>
<ul>
  <li>Минимальная длина пароля — 12 символов</li>
  <li>Обязательно использование букв разного регистра, цифр и спецсимволов</li>
  <li>Смена пароля — каждые 90 дней</li>
  <li>Запрещено использовать 5 последних паролей</li>
</ul>
<p>Подробности — на корпоративном портале.</p>
<p>С уважением,<br/>Отдел кадров</p>`,
    date: '2026-04-03T09:00:00',
    isRead: true
  },
  {
    id: 'base-2',
    folder: 'inbox',
    from: 'IT поддержка',
    fromEmail: 'it-support@company.local',
    subject: 'Плановое обслуживание серверов',
    body: `<p>Добрый день!</p>
<p>В субботу, 5 апреля, с 02:00 до 06:00 будет проводиться плановое техническое обслуживание серверов. В это время могут быть недоступны:</p>
<ul>
  <li>Корпоративный портал</li>
  <li>Внутренняя файловая система</li>
  <li>VPN-подключения</li>
</ul>
<p>Приносим извинения за возможные неудобства.</p>
<p>IT отдел</p>`,
    date: '2026-04-02T14:30:00',
    isRead: false
  },
  {
    id: 'base-3',
    folder: 'inbox',
    from: 'Система',
    fromEmail: 'noreply@company.local',
    subject: 'Добро пожаловать в корпоративную почту',
    body: `<p>Здравствуйте!</p>
<p>Ваш корпоративный почтовый ящик успешно настроен.</p>
<p>Важные правила:</p>
<ul>
  <li>Не открывайте подозрительные вложения</li>
  <li>Проверяйте адрес отправителя</li>
  <li>Не переходите по ссылкам из неизвестных источников</li>
  <li>При сомнениях — обращайтесь в IT отдел</li>
</ul>
<p>Удачной работы!</p>`,
    date: '2026-04-01T08:00:00',
    isRead: true
  }
]

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function useMailState(events?: MailEvents) {
  const folders = ref<MailFolder[]>([...BASE_FOLDERS])
  const emails = ref<EmailConfig[]>(deepClone(BASE_EMAILS))

  const activeFolderId = ref<string>('inbox')
  const activeEmailId = ref<string | null>(null)

  const activeFolder = computed(
    () => folders.value.find((f) => f.id === activeFolderId.value) ?? folders.value[0]
  )

  const folderEmails = computed(() =>
    emails.value
      .filter((e) => e.folder === activeFolderId.value)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )

  const activeEmail = computed(() =>
    activeEmailId.value ? (emails.value.find((e) => e.id === activeEmailId.value) ?? null) : null
  )

  const unreadCounts = computed(() => {
    const counts: Record<string, number> = {}
    for (const folder of folders.value) {
      counts[folder.id] = emails.value.filter((e) => e.folder === folder.id && !e.isRead).length
    }
    return counts
  })

  const setActiveFolder = (folderId: string) => {
    activeFolderId.value = folderId
    activeEmailId.value = null
  }

  const openEmail = (emailId: string) => {
    activeEmailId.value = emailId
    const email = emails.value.find((e) => e.id === emailId)
    if (email && !email.isRead) {
      email.isRead = true
    }
    events?.onMailOpen?.(emailId)
  }

  const handleLinkClick = (url: string) => {
    if (!activeEmailId.value) return
    events?.onLinkClick?.(activeEmailId.value, url)
  }

  const handleAttachmentOpen = (attachmentId: string) => {
    if (!activeEmailId.value) return
    events?.onAttachmentOpen?.(activeEmailId.value, attachmentId)
  }

  const handleReply = (text: string) => {
    if (!activeEmailId.value) return
    events?.onReply?.(activeEmailId.value, text)
  }

  const addEmails = (newEmails: EmailConfig[]) => {
    emails.value.push(...deepClone(newEmails))
  }

  const addFolders = (newFolders: MailFolder[]) => {
    for (const folder of newFolders) {
      if (!folders.value.find((f) => f.id === folder.id)) {
        folders.value.push(folder)
      }
    }
  }

  return {
    folders: readonly(folders),
    emails: readonly(emails),
    activeFolderId: readonly(activeFolderId),
    activeFolder,
    activeEmail,
    activeEmailId: readonly(activeEmailId),
    folderEmails,
    unreadCounts,
    setActiveFolder,
    openEmail,
    handleLinkClick,
    handleAttachmentOpen,
    handleReply,
    addEmails,
    addFolders
  }
}
