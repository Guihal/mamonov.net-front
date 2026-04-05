<script setup lang="ts">
import type { FsFile } from '~~/shared/types/FsFile'
import OsWorkbenchShortcut from './Shortcut/index.vue'

const workbench: Ref<null | HTMLElement> = ref(null)
const { contentArea } = useContentArea()

const { cellsInElement, realCell, subscribe } = useGridCells(workbench, {
  width: 100,
  height: 120
})

const width = computed(() => contentArea.value.width)
const height = computed(() => contentArea.value.height)

const columns = computed(() => {
  const count = cellsInElement.x
  const size = realCell.value.width

  return `repeat(${count}, ${size}px)`
})

const rows = computed(() => {
  const count = cellsInElement.y
  const size = realCell.value.height
  return `repeat(${count}, ${size}px)`
})

onMounted(subscribe)

/**
 * Файлы рабочего стола — инжектируются уроком через provide('workbenchFiles', [...]).
 * Если не предоставлены — рабочий стол пуст.
 */
const files = inject<FsFile[]>('workbenchFiles', [])

const visibleFiles = computed(() => files.filter((f) => !f.hidden))

const { unFocus } = useFocusWindowController()
</script>
<template>
  <div ref="workbench" class="workbench" @click="unFocus">
    <OsWorkbenchShortcut v-for="file in visibleFiles" :key="file.path" :file />
  </div>
</template>
<style lang="scss">
.workbench {
  position: fixed;
  left: 0;
  top: 0;
  --offset: 10px;
  width: calc(v-bind(width) * 1px - var(--offset) * 2);
  height: calc(v-bind(height) * 1px - var(--offset) * 2);
  display: grid;
  grid-template-columns: v-bind(columns);
  grid-template-rows: v-bind(rows);
  box-sizing: border-box;
  margin: var(--offset);
  z-index: 1;
}
</style>
