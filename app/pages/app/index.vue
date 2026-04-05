<script setup lang="ts">
import { useMockDbStore } from '~/stores/useMockDbStore'
import { useUser } from '~/composables/user/useUser'
import { useUserStore } from '~/stores/useUserStore'

const db = useMockDbStore()
const userStore = useUser()
const gameStore = useUserStore()

const categories = computed(() => db.getCategories())

const user = computed(() => userStore.user)

const totalLessons = computed(() => {
  let total = 0
  let completed = 0
  for (const cat of categories.value) {
    const lessons = db.getLessons(cat.id)
    total += lessons.length
    completed += lessons.filter((l) => l.isCompleted).length
  }
  return { total, completed }
})

const levelsPercent = computed(() => {
  const { total, completed } = totalLessons.value
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

// Icon mapping for lessons
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

function getLessonStatus(
  categoryId: string,
  lesson: { id: string; slug: string; isCompleted: boolean }
): 'completed' | 'unlocked' | 'locked' {
  if (lesson.isCompleted) return 'completed'
  if (db.isLessonUnlocked(categoryId, lesson.slug)) return 'unlocked'
  return 'locked'
}

function getNextLesson(categoryId: string) {
  const lessons = db.getLessons(categoryId)
  return lessons.find((l) => !l.isCompleted && db.isLessonUnlocked(categoryId, l.slug))
}

onMounted(async () => {
  await gameStore.syncProgress()
  // Sync HP for all categories
  for (const cat of categories.value) {
    await gameStore.syncHp(cat.id)
  }
})
</script>

<template>
  <div class="dashboard">
    <!-- Profile Section -->
    <section class="profile-card">
      <div class="profile-card__avatar-area">
        <img src="/img/elephant_nacked.avif" alt="Маскот" class="profile-card__elephant" />
      </div>

      <div class="profile-card__info">
        <h1 class="profile-card__name">
          {{ user?.name ?? 'Игрок' }}
        </h1>
        <p class="profile-card__username">
          {{ user?.email ?? 'player@mamonov.net' }}
        </p>

        <div class="profile-card__stat">
          <div class="profile-card__stat-header">
            <UIcon
              name="i-lucide-heart"
              class="profile-card__stat-icon profile-card__stat-icon--hp"
            />
            <span class="profile-card__stat-label">Уровень здоровья</span>
          </div>
          <UProgress :model-value="gameStore.hpPercent" size="md" color="success" />
        </div>

        <div class="profile-card__stat">
          <div class="profile-card__stat-header">
            <UIcon
              name="i-lucide-star"
              class="profile-card__stat-icon profile-card__stat-icon--levels"
            />
            <span class="profile-card__stat-label">Пройдено уровней</span>
          </div>
          <UProgress :model-value="levelsPercent" size="md" color="primary" />
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="levels-section">
      <h2 class="levels-section__title">Уровни игры</h2>

      <div class="levels-section__grid">
        <div v-for="category in categories" :key="category.id" class="category-card">
          <div class="category-card__header">
            <h3 class="category-card__name">
              {{ category.name }}
            </h3>
            <UIcon :name="category.icon" class="category-card__icon" />
          </div>

          <!-- Category Progress -->
          <div class="category-card__progress">
            <div class="category-card__progress-header">
              <UIcon name="i-lucide-star" class="category-card__progress-icon" />
              <span class="category-card__progress-label">Пройдено уровней</span>
            </div>
            <UProgress
              :model-value="Math.round(db.getCategoryProgress(category.id) * 100)"
              size="md"
              color="primary"
            />
          </div>

          <!-- Stepper: lessons list -->
          <div class="category-card__stepper">
            <div
              v-for="(lesson, i) in db.getLessons(category.id)"
              :key="lesson.id"
              class="stepper-item"
              :class="{
                'stepper-item--completed': getLessonStatus(category.id, lesson) === 'completed',
                'stepper-item--unlocked': getLessonStatus(category.id, lesson) === 'unlocked',
                'stepper-item--locked': getLessonStatus(category.id, lesson) === 'locked'
              }"
            >
              <div class="stepper-item__icon-wrap">
                <UIcon :name="getLessonIcon(lesson.id)" class="stepper-item__icon" />
              </div>
              <span class="stepper-item__number">{{ i + 1 }}</span>
              <span class="stepper-item__title">{{ lesson.title }}</span>

              <UBadge
                v-if="getLessonStatus(category.id, lesson) === 'completed'"
                color="success"
                variant="subtle"
                class="stepper-item__badge"
              >
                Уровень пройден
              </UBadge>
              <UBadge
                v-else-if="getLessonStatus(category.id, lesson) === 'unlocked'"
                color="neutral"
                variant="subtle"
                class="stepper-item__badge"
              >
                Продолжить игру
              </UBadge>
              <UBadge v-else color="neutral" variant="outline" class="stepper-item__badge">
                Уровень закрыт
              </UBadge>

              <div
                v-if="i < db.getLessons(category.id).length - 1"
                class="stepper-item__separator"
              />
            </div>
          </div>

          <!-- Action button -->
          <UButton
            v-if="getNextLesson(category.id)"
            :to="`/app/categories/${category.slug}/${getNextLesson(category.id)!.slug}`"
            color="neutral"
            size="xl"
            block
            class="category-card__action"
          >
            <UIcon name="i-lucide-rocket" />
            Продолжить игру
          </UButton>
          <UButton
            v-else-if="db.getCategoryProgress(category.id) === 1"
            color="neutral"
            size="xl"
            block
            disabled
            class="category-card__action"
          >
            <UIcon name="i-lucide-check-circle" />
            Все уровни пройдены
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  max-width: 1360px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

// ── Profile Card ──
.profile-card {
  background: #ececec;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  gap: 40px;
  align-items: center;

  &__avatar-area {
    flex-shrink: 0;
    width: 310px;
    height: 300px;
    background: #6c5197;
    border-radius: 10px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
  }

  &__elephant {
    width: 260px;
    height: auto;
    object-fit: contain;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__name {
    font-size: 48px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--color-neutral-900);
  }

  &__username {
    font-size: 24px;
    font-weight: 500;
    color: var(--color-neutral-500);
    margin-bottom: 8px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__stat-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__stat-icon {
    width: 32px;
    height: 32px;

    &--hp {
      color: var(--color-success-500);
    }

    &--levels {
      color: var(--color-primary-500);
    }
  }

  &__stat-label {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-neutral-900);
  }
}

// ── Levels Section ──
.levels-section {
  &__title {
    font-size: 48px;
    font-weight: 500;
    color: var(--color-neutral-900);
    margin-bottom: 32px;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
}

// ── Category Card ──
.category-card {
  background: #ececec;
  border-radius: 20px;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__name {
    font-size: 32px;
    font-weight: 500;
    color: var(--color-neutral-900);
  }

  &__icon {
    width: 32px;
    height: 32px;
    color: var(--color-neutral-500);
  }

  &__progress {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__progress-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__progress-icon {
    width: 24px;
    height: 24px;
    color: var(--color-primary-500);
  }

  &__progress-label {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-neutral-900);
  }

  &__stepper {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__action {
    margin-top: 8px;
    font-size: 18px;
  }
}

// ── Stepper Item ──
.stepper-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  position: relative;

  &__icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: white;
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

  &__icon {
    width: 24px;
    height: 24px;
  }

  &__number {
    font-size: 18px;
    font-weight: 500;
    color: var(--color-neutral-500);
    min-width: 16px;
  }

  &__title {
    font-size: 18px;
    font-weight: 500;
    color: var(--color-neutral-900);
    flex: 1;
  }

  &--locked &__title {
    color: var(--color-neutral-400);
  }

  &__badge {
    flex-shrink: 0;
  }

  &__separator {
    position: absolute;
    left: 23px;
    bottom: -2px;
    width: 2px;
    height: 14px;
    background: var(--color-neutral-300);
    border-radius: 999px;
  }
}
</style>
