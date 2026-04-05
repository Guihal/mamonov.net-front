<script setup lang="ts">
import { useMascotStore } from '~/composables/mascot/useMascotStore'
import { useElephantMouse } from '~/composables/elephant/useElephantMouse'

const props = withDefaults(
  defineProps<{
    position?: 'fixed' | 'absolute' | 'relative'
  }>(),
  {
    position: 'fixed'
  }
)

const mascot = useMascotStore()
const elephantRef = ref<HTMLElement | null>(null)
const { translateX, translateY, start, stop } = useElephantMouse(elephantRef)

const emotion = computed(() => mascot.currentEmotion)
const isWorried = computed(() => emotion.value === 'worried')

const BASE_W = 430.49
const BASE_H = 288.24

// Brow positions (relative to elephant container)
const BROWS = {
  left: { x: 76.24, y: 94.25, w: 34, h: 22 },
  right: { x: 166.25, y: 88.95, w: 35, h: 20 }
}

function browStyle(side: 'left' | 'right') {
  const b = BROWS[side]
  return {
    left: `${(b.x / BASE_W) * 100}%`,
    top: `${(b.y / BASE_H) * 100}%`,
    width: `${(b.w / BASE_W) * 100}%`
  }
}

onMounted(() => start())
onUnmounted(() => stop())
</script>

<template>
  <div
    v-if="mascot.isVisible"
    ref="elephantRef"
    class="elephant"
    :class="`elephant--${props.position}`"
  >
    <ElephantSpeechBubble />

    <div class="elephant__face">
      <ElephantBody />

      <ElephantEyes :emotion="emotion" :translate-x="translateX" :translate-y="translateY" />

      <ElephantMouth :emotion="emotion" />
      <ElephantCheeks :emotion="emotion" />

      <!-- Brows (worried only) -->
      <svg
        class="brow"
        :class="{ 'brow--visible': isWorried }"
        :style="browStyle('left')"
        viewBox="0 0 34 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="1.5"
          y1="-1.5"
          x2="37.4365"
          y2="-1.5"
          transform="matrix(0.858377 -0.51302 0.512997 0.85839 0.982422 21.9932)"
          stroke="black"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>

      <svg
        class="brow"
        :class="{ 'brow--visible': isWorried }"
        :style="browStyle('right')"
        viewBox="0 0 35 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="1.5"
          y1="-1.5"
          x2="37.4364"
          y2="-1.5"
          transform="matrix(0.882073 0.471112 -0.47109 0.882085 -0.529297 2.11719)"
          stroke="black"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.elephant {
  right: 20px;
  bottom: 60px;
  z-index: 50;
  width: 200px;

  &--fixed {
    position: fixed;
  }

  &--absolute {
    position: absolute;
  }

  &--relative {
    position: relative;
    width: 100%;
    right: auto;
    bottom: auto;
  }

  --elephant-base-w: 430.49;
  --elephant-base-h: 288.24;

  &__face {
    position: relative;
    width: 100%;
  }
}

.brow {
  position: absolute;
  opacity: 0;
  transition: opacity 1s;
  z-index: 2;
  pointer-events: none;

  &--visible {
    opacity: 1;
  }
}
</style>
