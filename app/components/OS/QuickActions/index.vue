<script setup lang="ts">
import type { QuickAction } from '~/types/lesson'
import { GAME_CONTROLLER_KEY } from '~/types/game'

const allActions = inject<QuickAction[]>('quickActions', [])
const ctrl = inject(GAME_CONTROLLER_KEY, null)

const actions = computed(() => {
  const step = ctrl?.step.value ?? 0
  return allActions.filter((a) => !a.visibleOnSteps || a.visibleOnSteps.includes(step))
})

const isOpen = ref(false)

let hideTimer: ReturnType<typeof setTimeout> | null = null

function showMenu() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  isOpen.value = true
}

function scheduleHide() {
  hideTimer = setTimeout(() => {
    isOpen.value = false
  }, 120)
}
</script>

<template>
  <div
    v-if="actions.length"
    class="quick-actions"
    :class="{ 'quick-actions--open': isOpen }"
    @mouseenter="showMenu"
    @mouseleave="scheduleHide"
  >
    <div class="quick-actions__menu-wrap">
      <OSQuickActionsMenu :actions="actions" />
    </div>
    <div class="quick-actions__trigger">
      <span v-for="(letter, i) in 'ДЕЙСТВИЯ'.split('')" :key="i" class="quick-actions__letter">
        {{ letter }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.quick-actions {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 200;
  display: flex;
  flex-direction: row;
  align-items: stretch;

  &__trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    background: rgba(241, 245, 249, 0.85);
    backdrop-filter: blur(8px);
    border-radius: 0 8px 8px 0;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
    cursor: default;
    user-select: none;
    gap: 3px;
    position: relative;
    z-index: 1;
  }

  &__letter {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    line-height: 14px;
    color: #0f172b;
    display: block;
    text-align: center;
  }

  &__menu-wrap {
    overflow: hidden;
    max-width: 0;
    transition: max-width 0.22s ease;
    display: flex;
    align-items: stretch;

    .qa-menu {
      flex: 1;
    }
  }

  &--open &__menu-wrap {
    max-width: 300px;
  }
}
</style>
