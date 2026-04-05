<script setup lang="ts">
import type { WindowOb } from '~/components/OS/Window/Window'
import type { ProgramType } from '~~/shared/types/Program'
import { debounce } from '~/components/OS/Window/utils/debounce'
import { PROGRAMS } from '~/utils/PROGRAMS'

const { programType, windowObs, isPinned } = defineProps<{
  programType: ProgramType
  windowObs: WindowOb[]
  isPinned?: boolean
}>()

const icon = computed(() => {
  if (!PROGRAMS[programType]) return ''
  return PROGRAMS[programType].icon
})

const hasOpenWindows = computed(() => windowObs.length > 0)

const { focus } = useFocusWindowController()
const { register, unregister, setContainer, show, hide, updateWindowObs } = useTaskbarTooltips()

const container = ref<HTMLElement | null>(null)
const currentIndex = ref(0)

onMounted(() => {
  register(programType, windowObs)
  setContainer(programType, container.value)
})

watch(
  () => windowObs,
  (obs) => updateWindowObs(programType, obs),
  { deep: true }
)

onBeforeUnmount(() => {
  unregister(programType)
})

watch(currentIndex, () => {
  if (currentIndex.value > windowObs.length - 1) {
    currentIndex.value = 0
    return
  }

  const windowOb = windowObs[currentIndex.value]
  if (!windowOb) return

  focus(windowOb.id)
})

watch(
  () => windowObs.length,
  (len) => {
    if (len === 0) hide(programType)
  }
)

const onClick = debounce(() => {
  if (hasOpenWindows.value) {
    currentIndex.value++
  }
}, 50)

const onMouseover = debounce(() => {
  if (hasOpenWindows.value) show(programType)
}, 16)

const onMouseout = debounce(() => hide(programType), 16)
</script>

<template>
  <button
    ref="container"
    class="taskbar__el taskbar__program"
    :class="{
      'taskbar__program--pinned': isPinned,
      'taskbar__program--open': hasOpenWindows,
      'taskbar__program--pinned-only': isPinned && !hasOpenWindows
    }"
    @click="onClick"
    @mouseover="onMouseover"
    @mouseout="onMouseout"
  >
    <div class="taskbar__el_img" v-html="icon" />
    <!-- Индикатор открытых окон -->
    <span v-if="hasOpenWindows" class="taskbar__program-dot" />
  </button>
</template>

<style lang="scss">
.taskbar__program {
  --icon-color: #000;
  position: relative;

  .taskbar__el_img {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &--pinned-only {
    opacity: 0.4;
  }

  &-dot {
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #000;
  }
}
</style>
