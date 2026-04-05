<script setup lang="ts">
import type { FolderConfig } from '~/types/programs'

const props = defineProps<{
  root: FolderConfig
  currentPath: string[]
}>()

const emit = defineEmits<{
  navigateTo: [path: string[]]
}>()

function isActive(pathSegments: string[]): boolean {
  if (pathSegments.length > props.currentPath.length) return false
  return pathSegments.every((seg, i) => props.currentPath[i] === seg)
}

const isRootActive = computed(() => props.currentPath.length === 0)
</script>

<template>
  <aside class="explorer-sidebar">
    <!-- Корень -->
    <button
      class="explorer-sidebar__item"
      :class="{ 'explorer-sidebar__item--active': isRootActive }"
      @click="emit('navigateTo', [])"
    >
      <UIcon name="i-lucide-monitor" class="explorer-sidebar__icon" />
      <span>{{ root.name }}</span>
    </button>

    <!-- Верхний уровень папок -->
    <template v-for="child in root.children" :key="child.name">
      <button
        v-if="'children' in child"
        class="explorer-sidebar__item explorer-sidebar__item--child"
        :class="{ 'explorer-sidebar__item--active': isActive([child.name]) }"
        @click="emit('navigateTo', [child.name])"
      >
        <UIcon name="i-lucide-folder" class="explorer-sidebar__icon" />
        <span>{{ child.name }}</span>
      </button>
    </template>
  </aside>
</template>

<style lang="scss">
.explorer-sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 8px 4px;
  overflow-y: auto;

  &__item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 8px;
    border-radius: 6px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 13px;
    color: #374151;
    text-align: left;
    width: 100%;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }

    &--child {
      padding-left: 16px;
    }

    &--active {
      background-color: rgba(59, 130, 246, 0.12);
      color: #1d4ed8;

      .explorer-sidebar__icon {
        color: #1d4ed8;
      }
    }
  }

  &__icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #6b7280;
  }
}
</style>
