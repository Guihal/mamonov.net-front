<script setup lang="ts">
import { useRemoveWindow } from '../../utils/removeWindow'
import type { WindowOb } from '../../Window'

const windowOb = inject('windowOb') as WindowOb

const onclick = () => {
  useRemoveWindow(windowOb)
}
</script>
<template>
  <button class="window__nav_el window__close" @click="onclick" aria-label="Close window" />
</template>
<style lang="scss">
.window__close {
  background: #ee6b5f;
  box-shadow: inset 0 0 0 1px #e93f30;
}
</style>
