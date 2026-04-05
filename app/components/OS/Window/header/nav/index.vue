<script setup lang="ts">
import type { WindowOb } from '../../Window'

const windowOb = inject('windowOb') as WindowOb
</script>
<template>
  <div class="window__nav__wrapper">
    <OSWindowHeaderNavCollapse />
    <OSWindowHeaderNavFullscreen />
    <OSWindowHeaderNavClose />
  </div>
</template>
<style lang="scss">
.window__nav {
  z-index: 1000;
  position: relative;

  &_el {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter 0.15s ease-in-out;

    @media (hover: hover) {
      &:hover {
        filter: brightness(0.9);
      }
    }

    &:active {
      filter: brightness(0.8);
    }
  }

  &__wrapper {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 0 12px;
    flex-shrink: 0;
  }
}
</style>
