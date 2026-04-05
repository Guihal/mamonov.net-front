<script setup lang="ts">
import type { useMailState } from '~/composables/os/useMailState'

const mailState = inject('mailState') as ReturnType<typeof useMailState>
const { folders, activeFolderId, unreadCounts, setActiveFolder } = mailState
</script>

<template>
  <aside class="mail-sidebar">
    <div class="mail-sidebar__header">
      <span class="mail-sidebar__title">Почта</span>
    </div>
    <nav class="mail-sidebar__nav">
      <button
        v-for="folder in folders"
        :key="folder.id"
        class="mail-sidebar__item"
        :class="{ 'mail-sidebar__item--active': activeFolderId === folder.id }"
        @click="setActiveFolder(folder.id)"
      >
        <UIcon v-if="folder.icon" :name="folder.icon" class="mail-sidebar__icon" />
        <span class="mail-sidebar__name">{{ folder.name }}</span>
        <span v-if="(unreadCounts[folder.id] ?? 0) > 0" class="mail-sidebar__badge">
          {{ unreadCounts[folder.id] }}
        </span>
      </button>
    </nav>
  </aside>
</template>

<style lang="scss">
.mail-sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 8px;
  display: flex;
  flex-direction: column;

  &__header {
    padding: 6px 8px 4px;
    margin-bottom: 4px;
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 13px;
    color: #334155;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    transition: background 0.1s;

    &:hover {
      background: #f1f5f9;
    }

    &--active {
      background: #e2e8f0;
      font-weight: 500;
    }
  }

  &__icon {
    width: 16px;
    height: 16px;
    color: #64748b;
    flex-shrink: 0;
  }

  &__name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__badge {
    margin-left: auto;
    font-size: 11px;
    background: #3b82f6;
    color: #fff;
    border-radius: 9999px;
    padding: 0 6px;
    min-width: 18px;
    text-align: center;
    flex-shrink: 0;
  }
}
</style>
