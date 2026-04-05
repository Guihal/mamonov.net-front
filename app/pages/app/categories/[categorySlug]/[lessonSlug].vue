<script setup lang="ts">
definePageMeta({ layout: 'lesson', ssr: false })

import { useGameController } from '~/composables/game/useGameController'
import { useMascotStore } from '~/composables/mascot/useMascotStore'
import { useOsIsolated } from '~/composables/os/useOsIsolated'
import { LESSON_CONFIGS, LESSON_ON_MOUNTED } from '~/lessons'

const route = useRoute()
const slug = route.params.lessonSlug as string

const config = LESSON_CONFIGS[slug]
if (!config) {
  throw createError({ statusCode: 404, message: `Урок «${slug}» не найден` })
}
const { setTaskbarObserver, setViewportObserver } = useContentArea()

setViewportObserver()
// ── OS Isolation — включить ДО создания окон ──
const { setIsolated } = useOsIsolated()
setIsolated(true)

// ── Pinned programs ──
const { setPinnedPrograms, clearPinnedPrograms } = usePinnedPrograms()
setPinnedPrograms(config.programs)

// ── Game controller (provide/inject вниз) ──
useGameController(config)

// ── Mascot ──
const mascot = useMascotStore()

onMounted(() => {
  LESSON_ON_MOUNTED[slug]?.(mascot)
})

onUnmounted(() => {
  setIsolated(false)
  clearPinnedPrograms()
  mascot.$reset()
})
</script>

<template>
  <div class="lesson-page">
    <OSWorkbench />
    <OSWindowView />
    <OSQuickActions />
    <Elephant />
    <GameOver />

    <OSTaskbar />
    <OSTaskbarTooltips />
  </div>
</template>

<style lang="scss">
.lesson-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #f1f1f1;
  overflow: hidden;
  background: url('/img/bg.png') no-repeat center center;
  background-size: cover;

  &__menubar {
    position: relative;
    z-index: 100;
    height: 33px;
    background: rgba(196, 196, 196, 0.4);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 12px;
  }

  &__menubar-icons {
    display: flex;
    gap: 6px;
  }

  &__menubar-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    &--red {
      background: #ff5f57;
    }
    &--yellow {
      background: #febc2e;
    }
    &--green {
      background: #28c840;
    }
  }

  &__os {
    position: relative;
    width: 100%;
    height: calc(100% - 33px);
  }
}
</style>
