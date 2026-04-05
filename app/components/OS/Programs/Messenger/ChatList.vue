<script setup lang="ts">
import { useMessengerState } from '~/composables/os/useMessengerState'

const messengerState = inject('messengerState') as ReturnType<typeof useMessengerState>
const { chats, activeChatId, selectChat } = messengerState
</script>

<template>
  <aside class="messenger-list">
    <div class="messenger-list__header">
      <span class="messenger-list__title">Чаты</span>
    </div>
    <div class="messenger-list__items">
      <OSProgramsMessengerChatListItem
        v-for="chat in chats"
        :key="chat.id"
        :chat="chat"
        :is-active="activeChatId === chat.id"
        @click="selectChat(chat.id)"
      />
    </div>
  </aside>
</template>

<style lang="scss">
.messenger-list {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 260px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;

  &__header {
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #4b5563;
  }

  &__items {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
}
</style>
