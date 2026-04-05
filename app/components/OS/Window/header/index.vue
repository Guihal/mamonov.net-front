<script setup lang="ts">
import type { WindowOb } from '../Window'
import { useMove } from './useMove'

const windowOb = inject('windowOb') as WindowOb
const header = ref<null | HTMLElement>(null)
const { onPointerDown, onTouchStart } = useMove(windowOb)
</script>
<template>
  <div class="window__header" ref="header">
    <div class="window__header_el">
      <div
        class="window__header__wrapper"
        @pointerdown="onPointerDown"
        @touchstart.passive="onTouchStart"
      >
        <OSWindowHeaderName />
      </div>
      <OSWindowHeaderNav />
    </div>
  </div>
</template>
<style lang="scss">
.window__header {
  width: 100%;
  height: 36px;
  flex-shrink: 0;
  background: c('default-1');
  border-bottom: 1px solid c('border');
  user-select: none;

  &_el {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &__wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    touch-action: none;
  }
}

.window:not(.fullscreen) .window__header__wrapper {
  cursor: grab;
}

.drag {
  cursor: grabbing !important;
}
</style>
