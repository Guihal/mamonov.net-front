<script setup lang="ts">
import type { WindowOb } from '~/components/OS/Window/Window'
import { useScale } from '../../useScale'
import { getCalculatedBounds } from '~/composables/useWindowBounds'
import { useRemoveWindow } from '~/components/OS/Window/utils/removeWindow'

const { windowOb } = defineProps<{
  windowOb: WindowOb
}>()

const { contentArea } = useContentArea()
const { scaledHeight, scaledWidth, scale } = useScale()
const { getSrc } = useFrameObserver()

const srcRaw = getSrc(windowOb.id)

const src = ref(srcRaw.value)
watch(srcRaw, () => {
  if (!srcRaw.value) return
  src.value = srcRaw.value
})

const calculated = getCalculatedBounds(windowOb.id)

const frameWidth = computed(() => calculated.width * scale.value)
const frameHeight = computed(() => calculated.height * scale.value)

const frameLeft = computed(() => {
  return (
    Math.max(Math.min(contentArea.value.width - calculated.width, calculated.left), 0) * scale.value
  )
})

const frameTop = computed(() => {
  return (
    Math.max(Math.min(contentArea.value.height - calculated.height, calculated.top), 0) *
    scale.value
  )
})

const file = computed(() => windowOb.file)
const { title } = useWindowTitle(file)

const { focus } = useFocusWindowController()
const onclickframe = () => focus(windowOb.id)
const close = () => useRemoveWindow(windowOb)

const onPreview = () => {
  windowOb.states.preview = true
}
const offPreview = () => {
  delete windowOb.states.preview
}
</script>

<template>
  <div class="taskbar__frame-wrapper" @mouseenter="onPreview" @mouseleave="offPreview">
    <div class="taskbar__frame__header">
      <div v-if="title" class="taskbar__frame_name">{{ title }}</div>
      <div class="taskbar__frame-close" @click="close">
        <div class="taskbar__frame-close_el" />
        <div class="taskbar__frame-close_el" />
      </div>
    </div>
    <div
      class="taskbar__frame"
      :class="{
        'taskbar__frame--active': windowOb.states.focused === true
      }"
      :style="{
        'min-width': scaledWidth + 'px',
        'min-height': scaledHeight + 'px'
      }"
      @click="onclickframe"
    >
      <img
        :src
        :style="{
          width: frameWidth + 'px',
          height: frameHeight + 'px',
          'margin-top': frameTop + 'px',
          'margin-left': frameLeft + 'px'
        }"
        :width="frameWidth"
        :height="frameHeight"
        class="taskbar__frame-img"
      />
    </div>
  </div>
</template>

<style lang="scss">
.taskbar__frame {
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  transition: border-color 0.3s ease-in-out;
  cursor: pointer;
  user-select: none;
  overflow: hidden;

  &--active {
    border-color: rgba(0, 0, 0, 0.6);
  }

  &_name {
    font-size: 10px;
    max-width: 100%;
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    color: rgba(255, 255, 255, 0.9);
    width: fit-content;
  }

  &__header {
    gap: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  &-close {
    cursor: pointer;
    width: 14px;
    height: 14px;
    position: relative;
    flex-shrink: 0;

    &_el {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 1px;
      background: rgba(255, 255, 255, 0.7);

      &:first-child {
        transform: translate(-50%, -50%) rotate(45deg);
      }

      &:last-child {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }

    &:hover .taskbar__frame-close_el {
      background: #fff;
    }
  }

  &-wrapper {
    display: flex;
    flex-direction: column;
  }

  &-img {
    display: block;
  }
}
</style>
