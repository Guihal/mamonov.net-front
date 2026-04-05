<script setup lang="ts">
import { useMascotStore } from '~/composables/mascot/useMascotStore'

const mascot = useMascotStore()
</script>

<template>
  <Transition name="bubble">
    <div v-if="mascot.hasText" class="speech-bubble" @click="mascot.dismissPhrase()">
      <p class="speech-bubble__text">{{ mascot.currentPhrase?.text }}</p>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.speech-bubble {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.4;
  max-width: 200px;
  min-width: 100px;
  cursor: pointer;
  user-select: none;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: white;
    border-right: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    transform: rotate(45deg);
  }

  &__text {
    margin: 0;
    color: #1e293b;
  }
}

.bubble-enter-active,
.bubble-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
