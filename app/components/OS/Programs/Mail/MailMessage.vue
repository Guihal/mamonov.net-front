<script setup lang="ts">
import type { EmailConfig } from '~/types/programs'

defineProps<{
  email: EmailConfig
  isActive: boolean
}>()

defineEmits<{
  click: []
}>()

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (isToday) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

const preview = (body: string): string => {
  const text = body
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > 80 ? text.slice(0, 80) + '…' : text
}
</script>

<template>
  <button
    class="mail-message"
    :class="{
      'mail-message--active': isActive,
      'mail-message--unread': !email.isRead
    }"
    @click="$emit('click')"
  >
    <div class="mail-message__top">
      <span class="mail-message__from">{{ email.from }}</span>
      <span class="mail-message__date">{{ formatDate(email.date) }}</span>
    </div>
    <div class="mail-message__subject">{{ email.subject }}</div>
    <div class="mail-message__preview">{{ preview(email.body) }}</div>
    <div v-if="email.attachments?.length" class="mail-message__attachment-indicator">
      <UIcon name="i-lucide-paperclip" class="w-3 h-3" />
    </div>
  </button>
</template>

<style lang="scss">
.mail-message {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  background: transparent;
  border-left: none;
  border-right: none;
  border-top: none;
  transition: background 0.1s;

  &:hover {
    background: #f8fafc;
  }

  &--active {
    background: #eff6ff;

    &:hover {
      background: #eff6ff;
    }
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
  }

  &__from {
    font-size: 13px;
    font-weight: 500;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .mail-message--unread & {
      font-weight: 700;
    }
  }

  &__date {
    font-size: 11px;
    color: #94a3b8;
    flex-shrink: 0;
    margin-left: 8px;
  }

  &__subject {
    font-size: 13px;
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__preview {
    font-size: 12px;
    color: #94a3b8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 2px;
  }

  &__attachment-indicator {
    margin-top: 2px;
    color: #94a3b8;
  }
}
</style>
