<script setup lang="ts">
import type { BrowserEvents } from '~/types/programs'
import type { useBrowserTabs } from '~/composables/os/useBrowserTabs'
import type { useBrowserBookmarks } from '~/composables/os/useBrowserBookmarks'

const { navigateTo } = inject('browserTabs') as ReturnType<typeof useBrowserTabs>
const { allBookmarks } = inject('browserBookmarks') as ReturnType<typeof useBrowserBookmarks>
const browserEvents = inject<BrowserEvents>('browserEvents', {})

function onBookmarkClick(url: string) {
  navigateTo(url)
  browserEvents.onBookmarkClick?.(url)
}
</script>

<template>
  <div class="browser-bookmarks">
    <button
      v-for="bookmark in allBookmarks"
      :key="bookmark.url"
      class="browser-bookmarks__item"
      @click="onBookmarkClick(bookmark.url)"
    >
      <UIcon v-if="bookmark.icon" :name="bookmark.icon" class="browser-bookmarks__icon" />
      <img
        v-else-if="bookmark.favicon"
        :src="bookmark.favicon"
        class="browser-bookmarks__favicon"
        width="16"
        height="16"
        alt=""
      />
      <span class="browser-bookmarks__label">{{ bookmark.label }}</span>
    </button>
  </div>
</template>

<style lang="scss">
.browser-bookmarks {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border: none;
    background: transparent;
    border-radius: 4px;
    font-size: 12px;
    color: #3d4043;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;

    &:hover {
      background: #f1f3f4;
    }
  }

  &__icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #5f6368;
  }

  &__favicon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    object-fit: contain;
  }

  &__label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
