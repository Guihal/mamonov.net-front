<script setup lang="ts">
import type { useBrowserTabs } from '~/composables/os/useBrowserTabs'

const { tabs, activeTabId, setActiveTab, openTab, closeTab } = inject('browserTabs') as ReturnType<
  typeof useBrowserTabs
>
</script>

<template>
  <div class="browser-tabbar">
    <div class="browser-tabbar__tabs">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="browser-tabbar__tab"
        :class="{ 'browser-tabbar__tab--active': tab.id === activeTabId }"
        @click="setActiveTab(tab.id)"
      >
        <span class="browser-tabbar__tab-title">{{ tab.title }}</span>
        <button class="browser-tabbar__tab-close" @click.stop="closeTab(tab.id)">×</button>
      </div>
    </div>
    <button class="browser-tabbar__add" @click="openTab()">+</button>
  </div>
</template>

<style lang="scss">
.browser-tabbar {
  display: flex;
  align-items: flex-end;
  background: #dfe1e5;
  height: 36px;
  border-bottom: 1px solid #dadce0;
  padding: 0 8px;
  gap: 2px;
  flex-shrink: 0;

  &__tabs {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    overflow-x: auto;
    min-width: 0;
    flex: 1;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__tab {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 30px;
    padding: 0 12px;
    border: none;
    border-radius: 6px 6px 0 0;
    background: transparent;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 10px;
    color: #3d4043;
    cursor: pointer;
    white-space: nowrap;
    max-width: 200px;
    min-width: 60px;
    transition: background 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    &--active {
      background: #ffffff;

      &:hover {
        background: #ffffff;
      }
    }
  }

  &__tab-title {
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    text-align: left;
  }

  &__tab-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: none;
    background: transparent;
    border-radius: 50%;
    font-size: 12px;
    line-height: 1;
    color: #5f6368;
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
      background: #e8eaed;
    }
  }

  &__add {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 50%;
    font-size: 16px;
    color: #5f6368;
    cursor: pointer;
    flex-shrink: 0;
    margin-bottom: 2px;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
