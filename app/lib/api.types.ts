// ── Auth ──
export interface RegisterBody {
  name: string
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

// ── Progress ──

export interface LessonProgress {
  lessonId: string
  categoryId: string
  completedAt: string // ISO 8601
  attempts: number
}

export interface HpStateExtended extends HpState {
  isDepleted: boolean
  restoredAt: string | null // ISO 8601 или null
}

export interface GameProgress {
  total_progress: number
  completed_lessons: number
  total_lessons: number
  reputation_score: number
}
