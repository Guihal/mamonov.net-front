<script setup lang="ts">
import type { ProgramType } from '~~/shared/types/Program'

const { windowsGroupByProgram } = useWindowsGroupByProgram()
const { pinnedPrograms } = usePinnedPrograms()

/**
 * Все программы, которые должны отображаться в таскбаре:
 * - Закреплённые (из конфига урока) — всегда, даже без открытых окон
 * - Незакреплённые — только пока есть открытые окна
 */
const visiblePrograms = computed(() => {
  const result: ProgramType[] = []
  const seen = new Set<ProgramType>()

  // Сначала закреплённые
  for (const p of pinnedPrograms.value) {
    if (!seen.has(p)) {
      result.push(p)
      seen.add(p)
    }
  }

  // Потом незакреплённые, у которых есть открытые окна
  for (const p of Object.keys(windowsGroupByProgram.value) as ProgramType[]) {
    if (!seen.has(p) && (windowsGroupByProgram.value[p]?.length ?? 0) > 0) {
      result.push(p)
      seen.add(p)
    }
  }

  return result
})
</script>

<template>
  <TransitionGroup name="taskbar__el">
    <OSTaskbarElementsProgram
      v-for="programType in visiblePrograms"
      :key="programType"
      :window-obs="windowsGroupByProgram[programType] ?? []"
      :program-type="programType"
      :is-pinned="pinnedPrograms.includes(programType)"
    />
  </TransitionGroup>
</template>

<style lang="scss">
.taskbar__el-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.taskbar__el-leave-to {
  opacity: 0;
}
</style>
