<script setup lang="ts">
import type { MascotEmotion } from '~/types/mascot'

const props = defineProps<{
  side: 'left' | 'right'
  emotion: MascotEmotion
  translateX: number
  translateY: number
}>()

const BASE_W = 430.49
const BASE_H = 288.24
const EYE_SIZE = 50

const EYE_POSITIONS: Record<string, Record<MascotEmotion, { x: number; y: number }>> = {
  left: {
    neutral: { x: 86.85, y: 103.78 },
    sad: { x: 86.85, y: 103.78 },
    worried: { x: 86.85, y: 103.78 },
    happy: { x: 95.8, y: 103.78 }
  },
  right: {
    neutral: { x: 146.29, y: 103.78 },
    sad: { x: 146.29, y: 103.78 },
    worried: { x: 146.29, y: 103.78 },
    happy: { x: 146.36, y: 103.78 }
  }
}

const PUPIL_SIZES: Record<MascotEmotion, Record<string, number>> = {
  neutral: { left: 20, right: 20 },
  happy: { left: 35, right: 35 },
  sad: { left: 20, right: 20 },
  worried: { left: 15, right: 26.96 }
}

const WORRIED_OFFSETS: Record<string, { x: number; y: number }> = {
  left: { x: 27.51, y: 15.89 },
  right: { x: 9.37, y: 12.71 }
}

const EYELID_OFFSETS: Record<string, { top: number; left: number }> = {
  left: { top: -13.77, left: 0 },
  right: { top: -13.77, left: 3 }
}

const eyeStyle = computed(() => {
  const pos = EYE_POSITIONS[props.side]?.[props.emotion]
  if (!pos) return {}
  return {
    left: `${(pos.x / BASE_W) * 100}%`,
    top: `${(pos.y / BASE_H) * 100}%`,
    width: `${(EYE_SIZE / BASE_W) * 100}%`
  }
})

const pupilStyle = computed(() => {
  const size = PUPIL_SIZES[props.emotion]?.[props.side] ?? 20
  const sizePercent = `${(size / EYE_SIZE) * 100}%`

  if (props.emotion === 'worried') {
    const offset = WORRIED_OFFSETS[props.side]
    if (!offset) return { width: sizePercent }
    return {
      width: sizePercent,
      left: `${(offset.x / EYE_SIZE) * 100}%`,
      top: `${(offset.y / EYE_SIZE) * 100}%`,
      transform: `translate(${props.translateX}%, ${props.translateY}%)`
    }
  }

  if (props.emotion === 'happy') {
    return {
      width: sizePercent,
      left: '50%',
      top: '50%',
      transform: `translate(calc(-50% + ${props.translateX}%), calc(-50% + ${props.translateY}%))`
    }
  }

  return {
    width: sizePercent,
    left: '50%',
    top: '50%',
    transform: `translate(calc(-50% + ${props.translateX}%), calc(-50% + ${props.translateY}%))`
  }
})

const eyelidStyle = computed(() => {
  const offset = EYELID_OFFSETS[props.side]
  if (!offset) return {}
  return {
    width: `${(60 / EYE_SIZE) * 100}%`,
    height: `${(27 / EYE_SIZE) * 100}%`,
    top: `${(offset.top / EYE_SIZE) * 100}%`,
    left: `${(offset.left / EYE_SIZE) * 100}%`
  }
})

const isHappy = computed(() => props.emotion === 'happy')
const isSad = computed(() => props.emotion === 'sad')
</script>

<template>
  <div class="eye" :style="eyeStyle">
    <!-- Pupil: heart for happy, circle for others -->
    <svg
      v-if="isHappy"
      class="pupil pupil--heart"
      :style="pupilStyle"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.6648 20.3846C29.8343 18.2588 32.0329 15.7107 32.0329 12.3764C32.0329 10.2525 31.1892 8.21555 29.6874 6.71372C28.1855 5.21189 26.1486 4.36816 24.0247 4.36816C21.4621 4.36816 19.6566 5.09618 17.4725 7.28024C15.2885 5.09618 13.483 4.36816 10.9203 4.36816C8.79642 4.36816 6.7595 5.21189 5.25766 6.71372C3.75583 8.21555 2.91211 10.2525 2.91211 12.3764C2.91211 15.7253 5.09617 18.2733 7.28023 20.3846L17.4725 30.5769L27.6648 20.3846Z"
        fill="#FB2C36"
      />
    </svg>
    <div v-else class="pupil pupil--circle" :style="pupilStyle" />

    <!-- Eyelid (sad only) -->
    <div class="eyelid" :class="{ 'eyelid--visible': isSad }" :style="eyelidStyle" />
  </div>
</template>

<style scoped lang="scss">
.eye {
  position: absolute;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid #f8fafc;
  background: white;
  transition:
    left 1s,
    top 1s;
  z-index: 1;
}

.pupil {
  position: absolute;
  aspect-ratio: 1;
  border-radius: 50%;
  transition:
    width 1s,
    left 1s,
    top 1s;

  &--circle {
    background: black;
  }

  &--heart {
    border-radius: 0;
    overflow: visible;
  }
}

.eyelid {
  position: absolute;
  background: #a57ce9;
  opacity: 0;
  transform: translateY(-100%);
  transition:
    opacity 1s,
    transform 1s;
  z-index: 2;

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
