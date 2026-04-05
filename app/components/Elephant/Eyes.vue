<script setup lang="ts">
import type { MascotEmotion } from '~/types/mascot'

defineProps<{
  emotion: MascotEmotion
  translateX: number
  translateY: number
}>()
</script>

<template>
  <div class="eyes">
    <ElephantEye
      side="left"
      :emotion="emotion"
      :translate-x="translateX"
      :translate-y="translateY"
    />
    <ElephantEye
      side="right"
      :emotion="emotion"
      :translate-x="translateX"
      :translate-y="translateY"
    />
  </div>
</template>

<style scoped lang="scss">
.eyes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
