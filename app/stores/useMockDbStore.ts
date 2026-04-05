import type { HpHitResponse, HpStateExtended, LessonProgress } from '~/lib/api.types'
import type { User } from '~/composables/user/User.d'

// ── Types ──

export interface MockUser {
  name: string
  email: string
  password: string
}

export interface MockCategory {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  difficulty: 1 | 2 | 3
  order: number
}

export interface MockLesson {
  id: string
  slug: string
  categoryId: string
  title: string
  description: string
  order: number
  isCompleted: boolean
}

interface MockHpEntry {
  current: number
  max: number
  restoredAt: string | null
}

interface MockDbState {
  categories: MockCategory[]
  lessons: Record<string, MockLesson[]>
  hp: Record<string, MockHpEntry>
  progress: LessonProgress[]
  users: MockUser[]
  currentUserEmail: string | null
}

// ── Seed data ──

const SEED_CATEGORIES: MockCategory[] = [
  {
    id: 'office',
    slug: 'office',
    name: 'Офис',
    description: 'Угрозы в корпоративной среде',
    icon: 'lucide:building-2',
    difficulty: 1,
    order: 0
  },
  {
    id: 'home',
    slug: 'home',
    name: 'Дом',
    description: 'Безопасность домашней сети и устройств',
    icon: 'lucide:house',
    difficulty: 1,
    order: 1
  },
  {
    id: 'public-wifi',
    slug: 'public-wifi',
    name: 'Общественный Wi-Fi',
    description: 'Риски публичных сетей',
    icon: 'lucide:wifi',
    difficulty: 2,
    order: 2
  }
]

const SEED_LESSONS: Record<string, MockLesson[]> = {
  office: [
    {
      id: 'office-phishing-message',
      slug: 'office-phishing-message',
      categoryId: 'office',
      title: 'Фишинг в мессенджере',
      description: 'Научитесь распознавать фишинговые сообщения в рабочих чатах',
      order: 0,
      isCompleted: false
    },
    {
      id: 'office-phishing-email',
      slug: 'office-phishing-email',
      categoryId: 'office',
      title: 'Фишинговое письмо',
      description: 'Определите поддельное письмо среди настоящих',
      order: 1,
      isCompleted: false
    },
    {
      id: 'office-social-engineering',
      slug: 'office-social-engineering',
      categoryId: 'office',
      title: 'Социальная инженерия',
      description: 'Противостояние манипуляциям по телефону',
      order: 2,
      isCompleted: false
    }
  ],
  home: [
    {
      id: 'home-fake-update',
      slug: 'home-fake-update',
      categoryId: 'home',
      title: 'Фейковое обновление',
      description: 'Распознайте поддельное обновление системы',
      order: 0,
      isCompleted: false
    },
    {
      id: 'home-weak-password',
      slug: 'home-weak-password',
      categoryId: 'home',
      title: 'Слабый пароль',
      description: 'Узнайте, почему простые пароли опасны',
      order: 1,
      isCompleted: false
    },
    {
      id: 'home-wifi-security',
      slug: 'home-wifi-security',
      categoryId: 'home',
      title: 'Безопасность домашнего Wi-Fi',
      description: 'Настройте домашний роутер безопасно',
      order: 2,
      isCompleted: false
    }
  ],
  'public-wifi': [
    {
      id: 'wifi-traffic-sniff',
      slug: 'wifi-traffic-sniff',
      categoryId: 'public-wifi',
      title: 'Перехват трафика',
      description: 'Поймите, как злоумышленники перехватывают данные',
      order: 0,
      isCompleted: false
    },
    {
      id: 'wifi-evil-twin',
      slug: 'wifi-evil-twin',
      categoryId: 'public-wifi',
      title: 'Поддельная точка доступа',
      description: 'Определите фальшивую Wi-Fi сеть',
      order: 1,
      isCompleted: false
    },
    {
      id: 'wifi-captive-portal',
      slug: 'wifi-captive-portal',
      categoryId: 'public-wifi',
      title: 'Фейковый портал авторизации',
      description: 'Не попадитесь на поддельную страницу входа',
      order: 2,
      isCompleted: false
    }
  ]
}

const SEED_HP: Record<string, MockHpEntry> = {
  office: { current: 3, max: 3, restoredAt: null },
  home: { current: 3, max: 3, restoredAt: null },
  'public-wifi': { current: 3, max: 3, restoredAt: null }
}

// ── Helpers ──

const STORAGE_KEY = 'mockDb'

function loadFromStorage(): MockDbState | null {
  if (import.meta.server) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToStorage(state: MockDbState) {
  if (import.meta.server) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota errors
  }
}

function createSeed(): MockDbState {
  return {
    categories: structuredClone(SEED_CATEGORIES),
    lessons: structuredClone(SEED_LESSONS),
    hp: structuredClone(SEED_HP),
    progress: [],
    users: [],
    currentUserEmail: null
  }
}

// ── Store ──

export const useMockDbStore = defineStore('mockDb', () => {
  const saved = loadFromStorage()
  const seed = saved ?? createSeed()

  const categories = ref<MockCategory[]>(seed.categories)
  const lessons = ref<Record<string, MockLesson[]>>(seed.lessons)
  const hp = ref<Record<string, MockHpEntry>>(seed.hp)
  const progress = ref<LessonProgress[]>(seed.progress)
  const users = ref<MockUser[]>(seed.users)
  const currentUserEmail = ref<string | null>(seed.currentUserEmail)

  // Persist on every change
  watch(
    [categories, lessons, hp, progress, users, currentUserEmail],
    () => {
      saveToStorage({
        categories: categories.value,
        lessons: lessons.value,
        hp: hp.value,
        progress: progress.value,
        users: users.value,
        currentUserEmail: currentUserEmail.value
      })
    },
    { deep: true }
  )

  // ── Categories ──

  function getCategories(): MockCategory[] {
    return categories.value
  }

  function getCategoryBySlug(slug: string): MockCategory | undefined {
    return categories.value.find((c) => c.slug === slug)
  }

  // ── Lessons ──

  function getLessons(categoryId: string): MockLesson[] {
    return lessons.value[categoryId] ?? []
  }

  function getLessonBySlug(slug: string): MockLesson | undefined {
    for (const list of Object.values(lessons.value)) {
      const found = list.find((l) => l.slug === slug)
      if (found) return found
    }
    return undefined
  }

  function isLessonUnlocked(categoryId: string, slug: string): boolean {
    const list = lessons.value[categoryId]
    if (!list) return false
    const lesson = list.find((l) => l.slug === slug)
    if (!lesson) return false
    if (lesson.order === 0) return true
    const prev = list.find((l) => l.order === lesson.order - 1)
    return prev?.isCompleted === true
  }

  function completeLesson(lessonId: string): void {
    for (const list of Object.values(lessons.value)) {
      const lesson = list.find((l) => l.id === lessonId)
      if (lesson) {
        lesson.isCompleted = true

        // Add to progress if not already there
        if (!progress.value.some((p) => p.lessonId === lessonId)) {
          progress.value.push({
            lessonId,
            categoryId: lesson.categoryId,
            completedAt: new Date().toISOString(),
            attempts: 1
          })
        }
        break
      }
    }
  }

  // ── HP ──

  function getHp(categoryId: string): HpStateExtended {
    const entry = hp.value[categoryId] ?? { current: 3, max: 3, restoredAt: null }

    // Check if HP should be restored
    if (entry.restoredAt && new Date(entry.restoredAt).getTime() <= Date.now()) {
      entry.current = entry.max
      entry.restoredAt = null
    }

    return {
      current: entry.current,
      max: entry.max,
      isDepleted: entry.current <= 0,
      restoredAt: entry.restoredAt
    }
  }

  function hitHp(categoryId: string): HpHitResponse {
    if (!hp.value[categoryId]) {
      hp.value[categoryId] = { current: 3, max: 3, restoredAt: null }
    }
    const entry = hp.value[categoryId]
    entry.current = Math.max(0, entry.current - 1)
    const isDepleted = entry.current === 0

    if (isDepleted) {
      entry.restoredAt = new Date(Date.now() + 30 * 60_000).toISOString()
    }

    return { current: entry.current, max: entry.max, isDepleted }
  }

  // ── Progress ──

  function getProgress(): LessonProgress[] {
    return progress.value
  }

  function getCategoryProgress(categoryId: string): number {
    const list = lessons.value[categoryId]
    if (!list || list.length === 0) return 0
    const completed = list.filter((l) => l.isCompleted).length
    return completed / list.length
  }

  // ── Auth ──

  function registerUser(name: string, email: string, password: string): User {
    if (users.value.some((u) => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует')
    }
    users.value.push({ name, email, password })
    currentUserEmail.value = email
    return { name, email }
  }

  function loginUser(email: string, password: string): User {
    const user = users.value.find((u) => u.email === email)
    if (!user || user.password !== password) {
      throw new Error('Неверный email или пароль')
    }
    currentUserEmail.value = email
    return { name: user.name, email: user.email }
  }

  function getCurrentUser(): User | null {
    if (!currentUserEmail.value) return null
    const user = users.value.find((u) => u.email === currentUserEmail.value)
    if (!user) return null
    return { name: user.name, email: user.email }
  }

  function logoutUser(): void {
    currentUserEmail.value = null
  }

  // ── Reset ──

  function $reset() {
    const seed = createSeed()
    categories.value = seed.categories
    lessons.value = seed.lessons
    hp.value = seed.hp
    progress.value = seed.progress
    users.value = seed.users
    currentUserEmail.value = seed.currentUserEmail
  }

  return {
    // state
    categories,
    lessons,
    hp,
    progress,
    // categories
    getCategories,
    getCategoryBySlug,
    // lessons
    getLessons,
    getLessonBySlug,
    isLessonUnlocked,
    completeLesson,
    // hp
    getHp,
    hitHp,
    // progress
    getProgress,
    getCategoryProgress,
    // auth
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    // reset
    $reset
  }
})
