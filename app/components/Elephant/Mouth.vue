<script setup lang="ts">
import type { MascotEmotion } from '~/types/mascot'

defineProps<{
  emotion: MascotEmotion
}>()

const BASE_W = 430.49
const BASE_H = 288.24

// Mouth position (centered between cheeks, below eyes)
const MOUTH_POSITIONS = {
  default: { x: 161, y: 185, w: 39, h: 24 },
  sad: { x: 161, y: 185, w: 34, h: 31 },
  worried: { x: 161, y: 188, w: 47, h: 13 }
}

const defaultStyle = computed(() => {
  const p = MOUTH_POSITIONS.default
  return {
    left: `${(p.x / BASE_W) * 100}%`,
    top: `${(p.y / BASE_H) * 100}%`,
    width: `${(p.w / BASE_W) * 100}%`
  }
})

const sadStyle = computed(() => {
  const p = MOUTH_POSITIONS.sad
  return {
    left: `${(p.x / BASE_W) * 100}%`,
    top: `${(p.y / BASE_H) * 100}%`,
    width: `${(p.w / BASE_W) * 100}%`
  }
})

const worriedStyle = computed(() => {
  const p = MOUTH_POSITIONS.worried
  return {
    left: `${(p.x / BASE_W) * 100}%`,
    top: `${(p.y / BASE_H) * 100}%`,
    width: `${(p.w / BASE_W) * 100}%`
  }
})
</script>

<template>
  <div class="mouth-container">
    <!-- Default mouth (neutral / happy) -->
    <svg
      class="mouth"
      :class="{ 'mouth--active': emotion === 'neutral' || emotion === 'happy' }"
      :style="defaultStyle"
      viewBox="0 0 39 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34.0327 5.25344e-05C36.7865 2.41361 38.458 5.5196 38.4949 8.92C38.5789 16.7215 30.0292 23.1223 19.3994 23.2168C8.81589 23.3106 0.159649 17.1179 0.000860108 9.36413L5.04673 8.44911C5.01231 8.70852 4.99608 8.96518 4.99877 9.21742C5.01965 11.1445 6.09728 13.3008 8.65922 15.1439C11.2186 16.9849 14.9828 18.2561 19.3454 18.2174C23.7078 18.1786 27.4441 16.8415 29.9632 14.9555C32.4849 13.0674 33.5154 10.8913 33.4946 8.96416C33.4735 7.03729 32.3965 4.88147 29.8351 3.03868C29.7495 2.97711 29.661 2.91841 29.5724 2.85859L29.5438 2.7227C31.0973 1.93904 32.5961 1.0279 34.0327 5.25344e-05Z"
        fill="black"
        fill-opacity="0.7"
      />
    </svg>

    <!-- Sad mouth -->
    <svg
      class="mouth"
      :class="{ 'mouth--active': emotion === 'sad' }"
      :style="sadStyle"
      viewBox="0 0 34 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33.731 12.735C33.9443 9.07908 32.9047 5.70886 30.508 3.29617L30.2471 3.0419C24.6805 -2.18746 14.3314 -0.522348 6.92184 6.86744L6.57415 7.22131C-0.622558 14.6708 -2.14785 24.9417 3.18128 30.4086L7.37277 27.4575C7.16311 27.2996 6.9687 27.1305 6.79038 26.9511C5.43226 25.584 4.65257 23.3039 5.13723 20.1856C5.62172 17.0703 7.3572 13.496 10.4462 10.415C13.5355 7.33399 17.1109 5.61107 20.2225 5.13994C23.3371 4.66852 25.6092 5.46039 26.9675 6.82744C28.3255 8.19461 29.1061 10.4753 28.6213 13.5936C28.6057 13.6939 28.5861 13.7942 28.5672 13.8954L28.6509 14.0207C30.2965 13.4654 31.9939 13.0365 33.731 12.735Z"
        fill="black"
        fill-opacity="0.7"
      />
    </svg>

    <!-- Worried mouth (zigzag) -->
    <svg
      class="mouth"
      :class="{ 'mouth--active': emotion === 'worried' }"
      :style="worriedStyle"
      viewBox="0 0 47 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 11.0188C1.5 11.0188 4.42804 2.80131 8.23861 3.02699C11.8729 3.24223 10.6782 11.3816 14.3034 11.0188C17.6858 10.6803 16.1785 4.37579 19.3573 3.02699C23.7727 1.15345 25.1651 10.8519 29.8022 9.87714C33.8268 9.03111 33.1247 1.70558 37.2146 1.50473C41.4945 1.29455 41.3033 8.13816 45.301 9.87713"
        stroke="black"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.mouth-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.mouth {
  position: absolute;
  opacity: 0;
  transition: opacity 1s;

  &--active {
    opacity: 1;
  }
}
</style>
