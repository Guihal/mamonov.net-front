<script setup lang="ts">
import type { BrowserEvents } from '~/types/programs'

const browserEvents = inject<BrowserEvents>('browserEvents', {})

const fileName = ref('')
const checked = ref(false)
const isSafe = ref(true)

const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.msi', '.dll']

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  fileName.value = file.name
  checked.value = true
  isSafe.value = !DANGEROUS_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
  browserEvents.onFormSubmit?.('tools://file-checker', { fileName: file.name })
}
</script>

<template>
  <div class="file-checker">
    <div class="file-checker__content">
      <h2 class="file-checker__title">
        <UIcon name="i-lucide-file-search" class="file-checker__title-icon" />
        Проверка файла
      </h2>
      <p class="file-checker__desc">Загрузите файл для проверки на вредоносный код</p>
      <label class="file-checker__upload">
        <UIcon name="i-lucide-upload" class="file-checker__upload-icon" />
        <span>{{ fileName || 'Выберите файл для проверки' }}</span>
        <input type="file" class="file-checker__file-input" @change="onFileSelect" />
      </label>
      <div
        v-if="checked"
        class="file-checker__result"
        :class="isSafe ? 'file-checker__result--safe' : 'file-checker__result--danger'"
      >
        <UIcon :name="isSafe ? 'i-lucide-check-circle' : 'i-lucide-alert-triangle'" />
        <div>
          <div class="file-checker__result-name">{{ fileName }}</div>
          <div>{{ isSafe ? 'Файл безопасен' : 'Обнаружена угроза!' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.file-checker {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px;
    max-width: 500px;
    width: 100%;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title-icon {
    color: #3b82f6;
  }

  &__desc {
    color: #6b7280;
    font-size: 14px;
  }

  &__upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 32px;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    cursor: pointer;
    color: #6b7280;
    transition:
      border-color 0.2s,
      background 0.2s;

    &:hover {
      border-color: #3b82f6;
      background: #eff6ff;
    }
  }

  &__upload-icon {
    width: 32px;
    height: 32px;
    color: #9ca3af;
  }

  &__file-input {
    display: none;
  }

  &__result {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;

    &--safe {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    &--danger {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
  }

  &__result-name {
    font-weight: 600;
    margin-bottom: 2px;
  }
}
</style>
