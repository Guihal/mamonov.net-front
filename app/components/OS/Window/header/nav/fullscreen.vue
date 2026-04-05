<script setup lang="ts">
import { OFFSET } from '~/utils/constants/OFFSET'
import type { WindowOb } from '../../Window'
import { setSize } from '../../utils/setSize'
import { getTargetBounds } from '~/composables/useWindowBounds'
const windowOb = inject('windowOb') as WindowOb

const onclick = () => {
  const target = getTargetBounds(windowOb.id)
  if (windowOb.states.fullscreen) {
    delete windowOb.states.fullscreen
    const UNFULLSCREENOFFSET = OFFSET * 2

    target.left = UNFULLSCREENOFFSET
    target.top = UNFULLSCREENOFFSET

    setSize(windowOb, 'width', target.width - UNFULLSCREENOFFSET * 2)
    setSize(windowOb, 'height', target.height - UNFULLSCREENOFFSET * 2)
  } else {
    windowOb.states.fullscreen = true
  }
}
</script>
<template>
  <button
    class="window__nav_el window__fullscreen"
    @click="onclick"
    aria-label="Fullscreen window"
  />
</template>
<style lang="scss">
.window__fullscreen {
  background: #62c655;
  box-shadow: inset 0 0 0 1px #47ac3a;
}

.fullscreen {
  .window__fullscreen_el {
    translate: -30% -60%;

    &:last-child {
      translate: -75% -25%;
    }
  }
}
</style>
