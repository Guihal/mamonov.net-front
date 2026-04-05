<script setup lang="ts">
import type { useMailState } from '~/composables/os/useMailState'

const mailState = inject('mailState') as ReturnType<typeof useMailState>
const { folderEmails, activeEmailId, openEmail, activeFolder } = mailState
</script>

<template>
  <div class="mail-list">
    <div class="mail-list__header">
      <span class="mail-list__folder-name">{{ activeFolder?.name }}</span>
      <span class="mail-list__count">{{ folderEmails.length }}</span>
    </div>
    <div class="mail-list__items">
      <template v-if="folderEmails.length > 0">
        <OSProgramsMailMailMessage
          v-for="email in folderEmails"
          :key="email.id"
          :email="email"
          :is-active="activeEmailId === email.id"
          @click="openEmail(email.id)"
        />
      </template>
      <div v-else class="mail-list__empty">Нет писем</div>
    </div>
  </div>
</template>

<style lang="scss">
.mail-list {
  width: 300px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;

  &__header {
    padding: 8px 12px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  &__folder-name {
    font-size: 13px;
    font-weight: 600;
    color: #000;
  }

  &__count {
    font-size: 11px;
    color: #94a3b8;
  }

  &__items {
    flex: 1;
    overflow-y: auto;
  }

  &__empty {
    font-size: 14px;
    color: #94a3b8;
    text-align: center;
    padding: 32px 12px;
  }
}
</style>
