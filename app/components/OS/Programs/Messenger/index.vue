<script setup lang="ts">
import type { LessonConfig } from '~/types/lesson'
import type { MessengerEvents } from '~/types/programs'
import type { MessageConfig } from '~/types/programs'
import { useMessengerState } from '~/composables/os/useMessengerState'

const lessonConfig = inject<LessonConfig | null>('lessonConfig', null)
const events = inject<MessengerEvents | null>('messengerEvents', null) ?? {}

const messengerState = useMessengerState(events)

if (lessonConfig?.messengerChats) messengerState.addChats(lessonConfig.messengerChats)
if (lessonConfig?.messengerOpenChatId) messengerState.selectChat(lessonConfig.messengerOpenChatId)

const registerMessengerPushMessage = inject<
  ((fn: (chatId: string, message: MessageConfig) => void) => void) | null
>('registerMessengerPushMessage', null)
if (registerMessengerPushMessage) registerMessengerPushMessage(messengerState.pushMessage)

provide('messengerState', messengerState)
</script>

<template>
  <div class="messenger">
    <OSProgramsMessengerChatList />
    <OSProgramsMessengerChatView />
  </div>
</template>

<style lang="scss">
.messenger {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
