import type {
  RegisterBody,
  LoginBody,
  Category,
  Lesson,
  CompleteLessonResponse,
  HpState,
  HpHitResponse
} from './api.types'

// ── Auth ──

export function register(body: RegisterBody) {
  return $fetch('/auth/register', {
    method: 'POST',
    body,
    credentials: 'include'
  })
}

export function login(body: LoginBody) {
  return $fetch('/auth/login', {
    method: 'POST',
    body,
    credentials: 'include'
  })
}

export function refresh() {
  return $fetch('/auth/refresh', {
    method: 'POST',
    credentials: 'include'
  })
}

// ── Categories ──

export function getCategories() {
  return $fetch<Category[]>('/categories', {
    credentials: 'include'
  })
}

// ── Lessons ──

export function getLessons(catId: string) {
  return $fetch<Lesson[]>(`/categories/${catId}/lessons`, {
    credentials: 'include'
  })
}

export function completeLesson(lessonId: string) {
  return $fetch<CompleteLessonResponse>(`/lessons/${lessonId}/complete`, {
    method: 'POST',
    credentials: 'include'
  })
}

// ── HP ──

export function getHp(catId: string) {
  return $fetch<HpState>(`/categories/${catId}/hp`, {
    credentials: 'include'
  })
}

export function hitHp(categoryId: string) {
  return $fetch<HpHitResponse>('/hp/hit', {
    method: 'POST',
    body: { categoryId },
    credentials: 'include'
  })
}
