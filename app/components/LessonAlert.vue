<script setup lang="ts">
import { useMascotStore } from '~/composables/mascot/useMascotStore'

const mascot = useMascotStore()

const isVisible = ref(true)

function close() {
  isVisible.value = false
}
</script>

<template>
  <Transition name="alert-fade">
    <div v-if="isVisible && mascot.hasText" class="lesson-alert">
      <div class="lesson-alert__avatar">
        <img src="/img/elephant_nacked.avif" alt="Маскот" />
      </div>

      <p class="lesson-alert__text">
        {{ mascot.currentPhrase?.text }}
      </p>

      <UButton
        size="xs"
        variant="ghost"
        color="neutral"
        icon="i-lucide-x"
        class="lesson-alert__close"
        @click="close"
      />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.lesson-alert {
  position: fixed;
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;

  display: flex;
  align-items: center;
  gap: 12px;

  max-width: 866px;
  width: calc(100% - 32px);
  min-height: 76px;
  padding: 16px;

  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  &__avatar {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 9999px;
      background: rgba(0, 0, 0, 0.2);
    }
  }

  &__text {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #0f172b;
    margin: 0;
  }

  &__close {
    flex-shrink: 0;
  }
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>
