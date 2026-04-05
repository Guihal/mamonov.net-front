<script setup lang="ts">
import type { LessonConfig } from '~/types/lesson'
import type { MailEvents } from '~/types/programs'
import { useMailState } from '~/composables/os/useMailState'

const lessonConfig = inject<LessonConfig | null>('lessonConfig', null)
const events = inject<MailEvents | null>('mailEvents', null) ?? {}

const mailState = useMailState(events)

if (lessonConfig?.mailEmails) mailState.addEmails(lessonConfig.mailEmails)
if (lessonConfig?.mailFolders) mailState.addFolders(lessonConfig.mailFolders)

provide('mailState', mailState)
</script>

<template>
  <div class="mail">
    <OSProgramsMailMailSidebar />
    <OSProgramsMailMailList />
    <OSProgramsMailMailView />
  </div>
</template>

<style lang="scss">
.mail {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
