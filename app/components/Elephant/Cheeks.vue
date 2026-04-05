<script setup lang="ts">
import type { MascotEmotion } from '~/types/mascot'

defineProps<{
  emotion: MascotEmotion
}>()

const BASE_W = 430.49
const BASE_H = 288.24

const CHEEK_POSITIONS = {
  left: { x: 96, y: 164, w: 21, h: 23 },
  right: { x: 196, y: 150, w: 26, h: 23 }
}

function cheekStyle(side: 'left' | 'right') {
  const pos = CHEEK_POSITIONS[side]
  return {
    left: `${(pos.x / BASE_W) * 100}%`,
    top: `${(pos.y / BASE_H) * 100}%`,
    width: `${(pos.w / BASE_W) * 100}%`
  }
}
</script>

<template>
  <div class="cheeks">
    <!-- Left cheek -->
    <svg
      class="cheek"
      :class="{ 'cheek--worried': emotion === 'worried' }"
      :style="cheekStyle('left')"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21 23"
      fill="none"
    >
      <g clip-path="url(#cheek-left-clip)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2.8 10.5q1.5-.6 2.6-1.3Q6.7 8 6.9 6.6l.8-3.8q.4-.6.6-.7.5-.2.8-.2a1.3 1.3 0 0 1 1.3 1v.6l.2 1.1q.2 1.7.9 3.3 1.1 2.4 2.7 2.9 1.5.5 3.9 0h.4q1.2-.2 1.6 1 .1 1-1 1.4h-.5a14 14 0 0 0-6.2 4c-.4.4-1.1 1.8-1.8 2.6q-.7 1-1.5 1.3a2 2 0 0 1-1.6-.5l-.3-.6v-.5L6.8 18q-.5-1.4-1.5-2.6A5 5 0 0 0 3 13.7l-1.6-.4q-.7-.4-.9-.8A1.3 1.3 0 0 1 .9 11q.2-.3.8-.4zm6.1-1.8.2.4q1.8 3.2 4 4h.1l-2.8 2.4-1.1 1.7q-.6-1.6-1.9-3.1a8 8 0 0 0-2-2l1.7-1Q8.4 10 9 8.7"
          :fill="emotion === 'worried' ? '#e34a3e' : '#f0d28e'"
        />
      </g>
      <defs>
        <clipPath id="cheek-left-clip">
          <path fill="#fff" d="m.1 0 20.7.1-.1 22.6L0 22.6z" />
        </clipPath>
      </defs>
    </svg>

    <!-- Right cheek -->
    <svg
      class="cheek"
      :class="{ 'cheek--worried': emotion === 'worried' }"
      :style="cheekStyle('right')"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26 23"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="m10.4 4.5-.2-1V.8c.2-.7 1-.8 1.2-.8 0 0 1-.1 1.3.8q.3 1.7 0 3.5.4 1.5 1 2.8c2 3.5 5.8 3.8 10 3.8q1 0 1.1 1-.1.9-1.1 1c-2.3.2-6.5 1.8-8 3.4q-.4.6-.8 2a8 8 0 0 1-1.2 2.6l-1.2 1q-.8.2-1.2-.1-.5-.2-.6-.8v-1.7c0-.7-.2-2.2-.5-3.4q-.1-1.1-.7-1.6c-1.2-1.1-3.2-1-5-.8H4q-1 .4-2.3.5c-1.2 0-1.3-.8-1.3-.9s-.1-.8.8-1l1.1-.3 1.2-.2c4-1 6.4-4 6.9-7.2M11.6 8a9 9 0 0 0 6.4 4.5 13 13 0 0 0-4.2 2.6q-.4.5-1 1.9 0-1.2-.4-2.3t-1-1.8a6 6 0 0 0-3-1.3q2.1-1.5 3.2-3.6"
        :fill="emotion === 'worried' ? '#e34a3e' : '#f0d28e'"
      />
      <path
        d="m11.4 0 .6.1q.5.1.7.8.3 1.5.1 3v.5q.3 1.6 1 2.8c1.9 3.5 5.7 3.9 9.9 3.8q1 0 1.1 1-.1.9-1.1 1a16 16 0 0 0-8 3.4q-.3.2-.4.8l-.4 1.1-.6 1.6-.7 1.1-1 1q-.9.2-1.3-.1-.4-.2-.6-.8v-1.7a20 20 0 0 0-.7-4.3l-.5-.7q-1-.8-2.3-.9l-2.6.1H4l-2.3.5q-.9 0-1-.4l-.3-.5v-.5l.8-.6h.5l.6-.2 1.2-.2c4-1 6.4-4 6.9-7.2l-.1-1.9V1q.1-.4.5-.7zm.2 8q-1 2.2-3.2 3.7 1.7.3 3 1.3.6.6 1 1.8l.4 2.3.5-1.1.5-.8a13 13 0 0 1 4.2-2.6q-4.2-.7-6.4-4.5"
        :fill="emotion === 'worried' ? '#e34a3e' : '#f0d28e'"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.cheeks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cheek {
  position: absolute;
  transition: fill 1s;

  path {
    transition: fill 1s;
  }
}
</style>
