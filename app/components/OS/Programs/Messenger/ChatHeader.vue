<script setup lang="ts">
import type { ChatConfig } from '~/types/programs'

const props = defineProps<{ chat: ChatConfig }>()

const messageCount = computed(() => props.chat.messages.length)
</script>

<template>
  <div class="messenger-header">
    <UAvatar :alt="chat.name" :src="chat.avatar" size="sm" />
    <div class="messenger-header__info">
      <span class="messenger-header__name">{{ chat.name }}</span>
      <span v-if="chat.isGroupChat" class="messenger-header__sub">
        {{ messageCount }} сообщений
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.messenger-header {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 12px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: -0.015em;
    color: #000;
    line-height: 1.2;
  }

  &__sub {
    font-size: 0.75rem;
    color: #94a3b8;
    line-height: 1;
  }
}
</style>
