<script setup lang="ts">
import type { FolderConfig, FileEntryConfig } from '~/types/programs'

const props = defineProps<{
  item: FolderConfig | FileEntryConfig
}>()

const emit = defineEmits<{
  openFolder: [name: string]
  openFile: [file: FileEntryConfig]
}>()

const isFolder = computed(() => 'children' in props.item)

const iconName = computed(() => {
  if (isFolder.value) return 'i-lucide-folder'
  const name = props.item.name.toLowerCase()
  if (name.endsWith('.pdf')) return 'i-lucide-file-text'
  if (name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.jpeg'))
    return 'i-lucide-image'
  if (name.endsWith('.exe') || name.endsWith('.bat')) return 'i-lucide-terminal'
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return 'i-lucide-table'
  if (name.endsWith('.docx') || name.endsWith('.doc')) return 'i-lucide-file-text'
  if (name.endsWith('.zip') || name.endsWith('.rar')) return 'i-lucide-archive'
  return 'i-lucide-file'
})

const isMalicious = computed(() => !isFolder.value && (props.item as FileEntryConfig).isMalicious)

const onClick = () => {
  if (isFolder.value) {
    emit('openFolder', props.item.name)
  } else {
    emit('openFile', props.item as FileEntryConfig)
  }
}
</script>

<template>
  <button
    class="file-entry"
    :class="{ 'file-entry--malicious': isMalicious }"
    @dblclick="onClick"
    @click.stop
  >
    <UIcon :name="iconName" class="file-entry__icon" />
    <span class="file-entry__name">{{ item.name }}</span>
  </button>
</template>

<style lang="scss">
.file-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 6px;
  border: none;
  background: none;
  cursor: pointer;
  width: 80px;
  min-height: 72px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &--malicious {
    .file-entry__icon {
      color: #dc2626;
    }
  }

  &__icon {
    width: 36px;
    height: 36px;
    color: #3b82f6;
    flex-shrink: 0;
  }

  &__name {
    font-size: 11px;
    line-height: 1.3;
    text-align: center;
    color: #1f2937;
    word-break: break-all;
    max-width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
