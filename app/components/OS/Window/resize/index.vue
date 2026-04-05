<script setup lang="ts">
import type { ChainedKey } from '../composables/useResizeForDirections'
import type { WindowOb } from '../Window'
import { useResizeForDirectionsEvent } from '../composables/useResizeForDirectionsEvent'

const { directions, windowOb } = defineProps<{
  directions: [ChainedKey] | [ChainedKey, ChainedKey]
  windowOb: WindowOb
}>()

const { onPointerDown, onTouchStart } = useResizeForDirectionsEvent(windowOb, directions)
</script>
<template>
  <div
    class="window__resize__controlls"
    :class="directions"
    @pointerdown="onPointerDown"
    @touchstart.passive="onTouchStart"
  ></div>
</template>
<style lang="scss">
.window__resize__controlls {
  --default-size: 100%;
  --default-size-px: 5px;
  --z-index-sides: 5;
  --z-index-corner: 10;
  cursor: pointer;
  touch-action: none;
  left: var(--left);
  top: var(--top);
  right: var(--right);
  bottom: var(--bottom);
  width: var(--width);
  height: var(--height);
  position: absolute;
}
</style>
