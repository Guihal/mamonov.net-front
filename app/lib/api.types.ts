// ── Auth ──
export interface RegisterBody {
  email: string
  password: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
}

// ── Categories ──
export interface Category {
  id: string
  name: string
  difficulty: 1 | 2 | 3 | 4
  progress: number
}

// ── Lessons ──
export interface Lesson {
  id: string
  title: string
  componentSlug: string
  difficulty: 1 | 2 | 3 | 4
  isCompleted: boolean
}

export interface CompleteLessonResponse {
  success: boolean
}

// ── HP ──
export interface HpState {
  current: number
  max: number
}

export interface HpHitResponse extends HpState {
  isDepleted: boolean
}
