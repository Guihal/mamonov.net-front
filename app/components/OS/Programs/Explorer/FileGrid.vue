<script setup lang="ts">
import type { FolderConfig, FileEntryConfig } from '~/types/programs'

const props = defineProps<{
  folders: FolderConfig[]
  files: FileEntryConfig[]
}>()

const emit = defineEmits<{
  openFolder: [name: string]
  openFile: [file: FileEntryConfig]
}>()
</script>

<template>
  <div class="file-grid">
    <OSProgramsExplorerFileEntry
      v-for="folder in folders"
      :key="'f-' + folder.name"
      :item="folder"
      @open-folder="emit('openFolder', $event)"
      @open-file="emit('openFile', $event)"
    />
    <OSProgramsExplorerFileEntry
      v-for="file in files"
      :key="'e-' + file.name"
      :item="file"
      @open-folder="emit('openFolder', $event)"
      @open-file="emit('openFile', $event)"
    />
    <div v-if="folders.length === 0 && files.length === 0" class="file-grid__empty">
      Папка пуста
    </div>
  </div>
</template>

<style lang="scss">
.file-grid {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
  overflow-y: auto;
  min-height: 0;
  background: #ffffff;

  &__empty {
    color: #9ca3af;
    font-size: 13px;
    padding: 16px;
    width: 100%;
    text-align: center;
  }
}
</style>
