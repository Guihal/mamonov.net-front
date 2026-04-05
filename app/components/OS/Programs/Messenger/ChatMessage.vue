<script setup lang="ts">
import type { MessageConfig } from '~/types/programs'
import { useMessengerState } from '~/composables/os/useMessengerState'

const props = defineProps<{ message: MessageConfig }>()

const messengerState = inject('messengerState') as ReturnType<typeof useMessengerState>

const formattedTime = computed(() => {
  if (!props.message.timestamp) return ''
  if (/^\d{1,2}:\d{2}$/.test(props.message.timestamp)) return props.message.timestamp
  const d = new Date(props.message.timestamp)
  if (isNaN(d.getTime())) return ''
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
})

const URL_RE = /(https?:\/\/[^\s<]+)/g

const renderedHtml = computed(() => {
  const escaped = props.message.text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped.replace(URL_RE, '<a href="$1">$1</a>')
})

const handleClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'A') {
    const href = target.getAttribute('href')
    if (href) {
      e.preventDefault()
      messengerState.handleLinkClick(href)
    }
  }
}
</script>

<template>
  <div class="chat-message" :class="{ 'chat-message--own': message.isOwn }" @click="handleClick">
    <UAvatar
      v-if="!message.isOwn"
      :alt="message.sender"
      :src="message.senderAvatar"
      size="sm"
      class="chat-message__avatar"
    />

    <div class="chat-message__bubble">
      <span v-if="!message.isOwn" class="chat-message__sender">{{ message.sender }}</span>
      <span class="chat-message__text" v-html="renderedHtml" />
      <span v-if="formattedTime" class="chat-message__time">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.chat-message {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 75%;

  &--own {
    margin-left: auto;
    flex-direction: row-reverse;
  }

  &__avatar {
    flex-shrink: 0;
  }

  &__bubble {
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px;

    .chat-message--own & {
      background: #8b5cf6;
      border-color: #8b5cf6;
    }
  }

  &__sender {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #000;
    margin-bottom: 2px;
  }

  &__text {
    font-size: 0.75rem;
    line-height: 1rem;
    color: #314158;

    .chat-message--own & {
      color: #fff;
    }

    a {
      color: #3b82f6;
      text-decoration: underline;
      cursor: pointer;

      .chat-message--own & {
        color: #bfdbfe;
      }
    }
  }

  &__time {
    display: block;
    font-size: 0.625rem;
    color: #94a3b8;
    margin-top: 2px;
    text-align: right;

    .chat-message--own & {
      color: rgb(255 255 255 / 60%);
    }
  }
}
</style>
