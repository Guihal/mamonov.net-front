<script setup lang="ts">
import type { WindowOb } from '../Window'
import WindowResizeTop from './Top.vue'
import WindowResizeBottom from './Bottom.vue'
import WindowResizeLeft from './Left.vue'
import WindowResizeRight from './Right.vue'
import WindowResizeLeftBottom from './LeftBottom.vue'
import WindowResizeRightBottom from './RightBottom.vue'
import WindowResizeLeftTop from './LeftTop.vue'
import WindowResizeRightTop from './RightTop.vue'

const windowOb = inject('windowOb') as WindowOb
</script>
<template>
  <WindowResizeTop />
  <WindowResizeBottom />
  <WindowResizeLeft />
  <WindowResizeRight />
  <WindowResizeLeftBottom />
  <WindowResizeRightBottom />
  <WindowResizeLeftTop />
  <WindowResizeRightTop />
</template>
<style lang="scss"></style>
