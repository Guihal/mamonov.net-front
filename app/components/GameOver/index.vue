<template>
  <Transition name="gameover-overlay">
    <div
      v-if="isVisible && payload"
      class="gameover-overlay"
      aria-modal="true"
      role="dialog"
      aria-labelledby="gameover-title"
    >
      <div class="gameover-card">
        <!-- Режим: HP закончились -->
        <template v-if="payload.isDepleted">
          <UIcon name="i-lucide-heart-crack" class="gameover-icon gameover-icon--depleted" />
          <h2 id="gameover-title" class="gameover-title gameover-title--depleted">
            HP закончились
          </h2>
          <p class="gameover-body">
            Ты совершил слишком много ошибок. HP восстановятся автоматически — нужно немного
            подождать.
          </p>

          <GameOverDepletedTimer class="mt-4" />

          <div class="gameover-actions">
            <UButton color="neutral" variant="outline" @click="goToLessons">К урокам</UButton>
          </div>
        </template>

        <!-- Режим: Game Over (HP > 0) -->
        <template v-else>
          <UIcon name="i-lucide-shield-alert" class="gameover-icon gameover-icon--error" />
          <h2 id="gameover-title" class="gameover-title">Ошибка!</h2>
          <p class="gameover-reason">{{ payload.reason }}</p>

          <GameOverHpBar class="mt-5" />

          <div class="gameover-actions">
            <UButton color="primary" @click="handleRetry">Попробовать снова</UButton>
            <UButton color="neutral" variant="outline" @click="goToLessons">К урокам</UButton>
          </div>
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useGameOver } from '~/composables/game/useGameOver'

const { isVisible, payload, resetGameOver } = useGameOver()
const router = useRouter()

function handleRetry() {
  payload.value?.onRetry?.()
  resetGameOver()
}

function goToLessons() {
  const categoryId = payload.value?.categoryId
  resetGameOver()
  if (categoryId) {
    router.push(`/app/${categoryId}`)
  }
}
</script>

<style lang="scss">
.gameover-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.gameover-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  padding: 40px 32px;
  width: 100%;
  max-width: 420px;
  margin: 0 16px;
}

.gameover-icon {
  width: 52px;
  height: 52px;
  margin-bottom: 16px;

  &--error {
    color: #ef4444;
  }

  &--depleted {
    color: #f97316;
  }
}

.gameover-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 8px;

  &--depleted {
    color: #f97316;
  }
}

.gameover-reason {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  max-width: 300px;
}

.gameover-body {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  max-width: 300px;
}

.gameover-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 24px;
}

.gameover-overlay-enter-active,
.gameover-overlay-leave-active {
  transition: opacity 0.25s ease;

  .gameover-card {
    transition:
      transform 0.25s ease,
      opacity 0.25s ease;
  }
}

.gameover-overlay-enter-from,
.gameover-overlay-leave-to {
  opacity: 0;

  .gameover-card {
    transform: scale(0.92) translateY(12px);
    opacity: 0;
  }
}
</style>
