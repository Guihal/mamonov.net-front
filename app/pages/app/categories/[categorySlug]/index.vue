<script setup lang="ts">
import type { Category, Lesson } from '~/lib/api.types'
import { useMockDbStore } from '~/stores/useMockDbStore'
import { useUserStore } from '~/stores/useUserStore'

definePageMeta({ layout: 'default' })

const config = useRuntimeConfig()
const isBattleApi = config.public.isBattleApi

const route = useRoute()
const db = useMockDbStore()
const gameStore = useUserStore()

const CATEGORY_ICONS: Record<string, string> = {
  office: 'lucide:building-2',
  home: 'lucide:house',
  'public-wifi': 'lucide:wifi'
}

const LESSON_ICONS: Record<string, string> = {
  'office-phishing-message': 'i-lucide-message-square',
  'office-phishing-email': 'i-lucide-mail',
  'office-social-engineering': 'i-lucide-users',
  'home-weak-password': 'i-lucide-key-round',
  'home-fake-update': 'i-lucide-download',
  'home-wifi-security': 'i-lucide-wifi',
  'wifi-traffic-sniff': 'i-lucide-radio',
  'wifi-evil-twin': 'i-lucide-wifi-off',
  'wifi-captive-portal': 'i-lucide-globe'
}

function getLessonIcon(lessonId: string): string {
  return LESSON_ICONS[lessonId] ?? 'i-lucide-shield'
}

// ── Unified display interfaces ──
interface DisplayLesson {
  id: string
  slug: string
  title: string
  isCompleted: boolean
  description?: string
}

interface DisplayCategory {
  id: string
  slug: string
  name: string
  icon: string
  progress: number
}

// ── State ──
const categorySlug = computed(() => route.params.categorySlug as string)

// Real API state
const apiCategory = ref<DisplayCategory | null>(null)
const apiLessons = ref<DisplayLesson[]>([])

// Unified accessors
const category = computed<DisplayCategory | null>(() => {
  if (isBattleApi) return apiCategory.value
  const c = db.getCategoryBySlug(categorySlug.value)
  if (!c) return null
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    progress: db.getCategoryProgress(c.id)
  }
})

const lessons = computed<DisplayLesson[]>(() => {
  if (isBattleApi) return apiLessons.value
  if (!category.value) return []
  return db.getLessons(category.value.id).map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    isCompleted: l.isCompleted,
    description: l.description
  }))
})

const categoryProgress = computed(() => {
  if (isBattleApi) return apiCategory.value?.progress ?? 0
  if (!category.value) return 0
  return db.getCategoryProgress(category.value.id)
})

function isLessonUnlocked(lessonId: string): boolean {
  const lst = lessons.value
  const idx = lst.findIndex((l) => l.id === lessonId)
  if (idx === 0) return true
  return idx > 0 && (lst[idx - 1]?.isCompleted ?? false)
}

function getLessonStatus(lesson: DisplayLesson): 'completed' | 'unlocked' | 'locked' {
  if (lesson.isCompleted) return 'completed'
  if (isLessonUnlocked(lesson.id)) return 'unlocked'
  return 'locked'
}

onMounted(async () => {
  const slug = categorySlug.value

  if (isBattleApi) {
    try {
      const [cat, ls] = await Promise.all([
        $fetch<Category>(`/categories/${slug}`, { credentials: 'include' }),
        $fetch<Lesson[]>(`/categories/${slug}/lessons`, { credentials: 'include' })
      ])

      apiCategory.value = {
        id: cat.id,
        slug: cat.id,
        name: cat.name,
        icon: CATEGORY_ICONS[cat.id] ?? 'lucide:shield',
        progress: cat.progress
      }

      apiLessons.value = ls.map((l) => ({
        id: l.id,
        slug: l.id,
        title: l.title,
        isCompleted: l.isCompleted
      }))

      await gameStore.syncHp(slug)
    } catch (e) {
      console.error('[categoryPage] Failed to load data:', e)
      await navigateTo('/app')
    }
  } else {
    const cat = db.getCategoryBySlug(slug)
    if (cat) {
      await gameStore.syncHp(cat.id)
    }
  }
})

// Redirect if category not found (mock mode)
watchEffect(() => {
  if (import.meta.client && !isBattleApi && !category.value) {
    navigateTo('/app')
  }
})
</script>

<template>
  <div v-if="category" class="category-page">
    <div class="category-page__header">
      <UButton to="/app" color="neutral" variant="ghost" icon="i-lucide-arrow-left" size="lg" />
      <h1 class="category-page__title">
        {{ category.name }}
      </h1>
      <UIcon :name="category.icon" class="category-page__icon" />
    </div>

    <!-- HP Bar -->
    <div class="category-page__hp">
      <div class="category-page__hp-header">
        <UIcon name="i-lucide-heart" class="category-page__hp-icon" />
        <span class="category-page__hp-label">Здоровье</span>
        <span class="category-page__hp-value">{{ gameStore.hp }} / {{ gameStore.maxHp }}</span>
      </div>
      <UProgress :model-value="gameStore.hpPercent" size="md" color="success" />
    </div>

    <!-- Progress -->
    <div class="category-page__progress">
      <div class="category-page__progress-header">
        <UIcon name="i-lucide-star" class="category-page__progress-icon" />
        <span class="category-page__progress-label">Пройдено уровней</span>
      </div>
      <UProgress :model-value="Math.round(categoryProgress * 100)" size="md" color="primary" />
    </div>

    <!-- Lessons List -->
    <div class="lessons-list">
      <NuxtLink
        v-for="(lesson, i) in lessons"
        :key="lesson.id"
        :to="
          getLessonStatus(lesson) !== 'locked'
            ? `/app/categories/${category.slug}/${lesson.slug}`
            : undefined
        "
        class="lesson-item"
        :class="{
          'lesson-item--completed': getLessonStatus(lesson) === 'completed',
          'lesson-item--unlocked': getLessonStatus(lesson) === 'unlocked',
          'lesson-item--locked': getLessonStatus(lesson) === 'locked'
        }"
      >
        <div class="lesson-item__icon-wrap">
          <UIcon
            v-if="getLessonStatus(lesson) === 'locked'"
            name="i-lucide-lock"
            class="lesson-item__icon"
          />
          <UIcon
            v-else-if="getLessonStatus(lesson) === 'completed'"
            name="i-lucide-check"
            class="lesson-item__icon"
          />
          <UIcon v-else :name="getLessonIcon(lesson.id)" class="lesson-item__icon" />
        </div>

        <div class="lesson-item__content">
          <div class="lesson-item__top">
            <span class="lesson-item__number">{{ i + 1 }}</span>
            <span class="lesson-item__title">{{ lesson.title }}</span>
          </div>
          <p v-if="lesson.description" class="lesson-item__desc">
            {{ lesson.description }}
          </p>
        </div>

        <UBadge
          v-if="getLessonStatus(lesson) === 'completed'"
          color="success"
          variant="subtle"
          class="lesson-item__badge"
        >
          Пройден
        </UBadge>
        <UBadge
          v-else-if="getLessonStatus(lesson) === 'unlocked'"
          color="primary"
          variant="subtle"
          class="lesson-item__badge"
        >
          Доступен
        </UBadge>
        <UBadge v-else color="neutral" variant="outline" class="lesson-item__badge">
          Закрыт
        </UBadge>

        <div v-if="i < lessons.length - 1" class="lesson-item__separator" />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__title {
    font-size: 40px;
    font-weight: 500;
    color: var(--color-neutral-900);
  }

  &__icon {
    width: 36px;
    height: 36px;
    color: var(--color-neutral-400);
  }

  &__hp,
  &__progress {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__hp-header,
  &__progress-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__hp-icon {
    width: 24px;
    height: 24px;
    color: var(--color-success-500);
  }

  &__hp-label {
    font-size: 18px;
    font-weight: 500;
    color: var(--color-neutral-900);
  }

  &__hp-value {
    font-size: 14px;
    color: var(--color-neutral-500);
    margin-left: auto;
  }

  &__progress-icon {
    width: 24px;
    height: 24px;
    color: var(--color-primary-500);
  }

  &__progress-label {
    font-size: 18px;
    font-weight: 500;
    color: var(--color-neutral-900);
  }
}

.lessons-list {
  display: flex;
  flex-direction: column;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  position: relative;
  text-decoration: none;
  transition: background 0.15s;

  &:not(&--locked):hover {
    background: var(--color-neutral-100);
  }

  &--locked {
    cursor: default;
    opacity: 0.6;
  }

  &__icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--color-neutral-100);
    transition: background 0.2s;
  }

  &--completed &__icon-wrap {
    background: var(--color-success-500);
    color: white;
  }

  &--unlocked &__icon-wrap {
    background: var(--color-neutral-900);
    color: white;
  }

  &--locked &__icon-wrap {
    background: var(--color-neutral-200);
    color: var(--color-neutral-400);
  }

  &__icon {
    width: 24px;
    height: 24px;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__number {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-neutral-500);
  }

  &__title {
    font-size: 18px;
    font-weight: 500;
    color: var(--color-neutral-900);
  }

  &--locked &__title {
    color: var(--color-neutral-400);
  }

  &__desc {
    font-size: 14px;
    color: var(--color-neutral-500);
    margin-top: 2px;
  }

  &__badge {
    flex-shrink: 0;
  }

  &__separator {
    position: absolute;
    left: 39px;
    bottom: -4px;
    width: 2px;
    height: 14px;
    background: var(--color-neutral-300);
    border-radius: 999px;
    z-index: 1;
  }
}
</style>
