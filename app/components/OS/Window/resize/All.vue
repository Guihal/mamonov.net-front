<script setup lang="ts">
import type { WindowOb } from '../Window'

const windowOb = inject('windowOb') as WindowOb
</script>
<template>
  <OSWindowResizeTop />
  <OSWindowResizeBottom />
  <OSWindowResizeLeft />
  <OSWindowResizeRight />
  <OSWindowResizeLeftBottom />
  <OSWindowResizeRightBottom />
  <OSWindowResizeLeftTop />
  <OSWindowResizeRightTop />
</template>
<style lang="scss"></style>
