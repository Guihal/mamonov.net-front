<script setup lang="ts">
import { useCollapsed } from '../../composables/useCollapsed'
import type { WindowOb } from '../../Window'
const windowOb = inject('windowOb') as WindowOb
const onclick = useCollapsed(windowOb)
</script>
<template>
  <button class="window__nav_el window__collapse" @click="onclick" aria-label="Minimize window" />
</template>
<style lang="scss">
.window__collapse {
  background: #f5be50;
  box-shadow: inset 0 0 0 1px #f2ad21;
}
</style>
