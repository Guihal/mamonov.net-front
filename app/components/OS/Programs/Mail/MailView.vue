<script setup lang="ts">
import type { useMailState } from '~/composables/os/useMailState'

const mailState = inject('mailState') as ReturnType<typeof useMailState>
const { activeEmail, handleLinkClick, handleAttachmentOpen } = mailState

const formatFullDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const onBodyClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const anchor = target.closest('a')
  if (anchor) {
    e.preventDefault()
    const url = anchor.getAttribute('href')
    if (url) handleLinkClick(url)
  }
}
</script>

<template>
  <div class="mail-view">
    <template v-if="activeEmail">
      <div class="mail-view__header">
        <h2 class="mail-view__subject">{{ activeEmail.subject }}</h2>
        <div class="mail-view__meta">
          <div class="mail-view__from-row">
            <span class="mail-view__from">{{ activeEmail.from }}</span>
            <span class="mail-view__from-email">&lt;{{ activeEmail.fromEmail }}&gt;</span>
          </div>
          <div v-if="activeEmail.to" class="mail-view__to">Кому: {{ activeEmail.to }}</div>
          <div class="mail-view__date">{{ formatFullDate(activeEmail.date) }}</div>
        </div>
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="mail-view__body" @click="onBodyClick" v-html="activeEmail.body" />

      <div v-if="activeEmail.attachments?.length" class="mail-view__attachments">
        <div class="mail-view__attachments-title">
          <UIcon name="i-lucide-paperclip" class="w-4 h-4" />
          Вложения ({{ activeEmail.attachments.length }})
        </div>
        <div class="mail-view__attachments-list">
          <OSProgramsMailMailAttachment
            v-for="att in activeEmail.attachments"
            :key="att.id"
            :attachment="att"
            @open="handleAttachmentOpen(att.id)"
          />
        </div>
      </div>
    </template>

    <div v-else class="mail-view__empty">
      <UIcon name="i-lucide-mail" class="w-12 h-12 mail-view__empty-icon" />
      <p>Выберите письмо для просмотра</p>
    </div>
  </div>
</template>

<style lang="scss">
.mail-view {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;

  &__header {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0;
  }

  &__subject {
    font-size: 18px;
    font-weight: 600;
    color: #000;
    margin: 0 0 8px;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__from-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  &__from {
    font-size: 14px;
    font-weight: 500;
    color: #000;
  }

  &__from-email {
    font-size: 13px;
    color: #64748b;
  }

  &__to {
    font-size: 13px;
    color: #64748b;
  }

  &__date {
    font-size: 13px;
    color: #94a3b8;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    font-size: 14px;
    line-height: 1.6;
    color: #334155;

    p {
      margin-bottom: 0.5rem;
    }

    ul,
    ol {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 0.25rem;
    }

    a {
      color: #2563eb;
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        color: #1d4ed8;
      }
    }
  }

  &__attachments {
    padding: 16px;
    border-top: 1px solid #e2e8f0;
    flex-shrink: 0;
  }

  &__attachments-title {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #475569;
    margin-bottom: 8px;
  }

  &__attachments-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #94a3b8;
    font-size: 14px;
  }

  &__empty-icon {
    color: #cbd5e1;
  }
}
</style>
