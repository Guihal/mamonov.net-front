<script setup lang="ts">
import type { ChatConfig } from '~/types/programs'
import { useMessengerState } from '~/composables/os/useMessengerState'

const props = defineProps<{
  chat: ChatConfig
  isActive: boolean
}>()

const messengerState = inject('messengerState') as ReturnType<typeof useMessengerState>
const lastMessage = computed(() => messengerState.getLastMessage(props.chat.id))
</script>

<template>
  <button class="messenger-list-item" :class="{ 'messenger-list-item--active': isActive }">
    <UAvatar :alt="chat.name" :src="chat.avatar" size="md" />
    <div class="messenger-list-item__info">
      <span class="messenger-list-item__name">{{ chat.name }}</span>
      <span v-if="lastMessage" class="messenger-list-item__preview">
        <template v-if="lastMessage.isOwn">Вы: </template>{{ lastMessage.text }}
      </span>
    </div>
  </button>
</template>

<style lang="scss">
.messenger-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: background 0.1s;

  &:hover {
    background: #f8fafc;
  }

  &--active {
    background: #f1f5f9;
  }

  &__info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  &__name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__preview {
    font-size: 0.75rem;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
