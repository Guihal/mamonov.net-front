<script setup lang="ts">
import type { AttachmentConfig } from '~/types/programs'

defineProps<{
  attachment: AttachmentConfig
}>()

defineEmits<{
  open: []
}>()

const getFileIcon = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const iconMap: Record<string, string> = {
    pdf: 'i-lucide-file-text',
    doc: 'i-lucide-file-text',
    docx: 'i-lucide-file-text',
    xls: 'i-lucide-file-spreadsheet',
    xlsx: 'i-lucide-file-spreadsheet',
    jpg: 'i-lucide-file-image',
    jpeg: 'i-lucide-file-image',
    png: 'i-lucide-file-image',
    zip: 'i-lucide-file-archive',
    rar: 'i-lucide-file-archive',
    exe: 'i-lucide-file-warning',
    bat: 'i-lucide-file-warning',
    js: 'i-lucide-file-code',
    html: 'i-lucide-file-code'
  }
  return iconMap[ext] ?? 'i-lucide-file'
}
</script>

<template>
  <button class="mail-attachment" @click="$emit('open')">
    <UIcon :name="attachment.icon ?? getFileIcon(attachment.name)" class="mail-attachment__icon" />
    <span class="mail-attachment__name">{{ attachment.name }}</span>
    <span class="mail-attachment__action">Открыть</span>
  </button>
</template>

<style lang="scss">
.mail-attachment {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  background: transparent;
  width: 100%;
  transition: background 0.1s;

  &:hover {
    background: #f8fafc;
  }

  &__icon {
    width: 20px;
    height: 20px;
    color: #64748b;
    flex-shrink: 0;
  }

  &__name {
    font-size: 14px;
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  &__action {
    font-size: 12px;
    color: #3b82f6;
    flex-shrink: 0;
    margin-left: auto;

    &:hover {
      color: #1d4ed8;
    }
  }
}
</style>
