<script setup lang="ts">
import { useMessengerState } from '~/composables/os/useMessengerState'

const messengerState = inject('messengerState') as ReturnType<typeof useMessengerState>

const inputText = ref('')

const send = () => {
  if (!inputText.value.trim()) return
  messengerState.sendMessage(inputText.value)
  inputText.value = ''
}
</script>

<template>
  <div class="messenger-input">
    <UInput
      v-model="inputText"
      placeholder="Сообщение..."
      size="md"
      class="messenger-input__field"
      @keydown.enter.prevent="send"
    />
    <UButton
      icon="i-lucide-send"
      size="md"
      variant="ghost"
      :disabled="!inputText.trim()"
      @click="send"
    />
  </div>
</template>

<style lang="scss">
.messenger-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;

  &__field {
    flex: 1;
  }
}
</style>
