<script setup lang="ts">
import { useMessengerState } from '~/composables/os/useMessengerState'

const messengerState = inject('messengerState') as ReturnType<typeof useMessengerState>
const { activeChat } = messengerState

const messagesContainer = ref<HTMLElement | null>(null)

watch(
  () => activeChat.value?.messages.length,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }
)
</script>

<template>
  <div class="messenger-view">
    <template v-if="activeChat">
      <OSProgramsMessengerChatHeader :chat="activeChat" />
      <div ref="messagesContainer" class="messenger-view__messages">
        <OSProgramsMessengerChatMessage
          v-for="msg in activeChat.messages"
          :key="msg.id"
          :message="msg"
        />
      </div>
      <OSProgramsMessengerInputBar />
    </template>
    <div v-else class="messenger-view__empty">
      <UIcon name="i-lucide-message-circle" class="messenger-view__empty-icon" />
      <span>Выберите чат</span>
    </div>
  </div>
</template>

<style lang="scss">
.messenger-view {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;

  &__messages {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    background: #f8fafc;
    padding: 12px;
  }

  &__empty {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #94a3b8;
  }

  &__empty-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
