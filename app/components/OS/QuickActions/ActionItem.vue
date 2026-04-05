<script setup lang="ts">
import type { QuickAction } from '~/types/lesson'

defineProps<{
  action: QuickAction
}>()
</script>

<template>
  <button class="qa-item" @click="action.onClick">
    <UIcon :name="action.icon" class="qa-item__icon" />
    <span class="qa-item__label">{{ action.label }}</span>
  </button>
</template>

<style lang="scss">
.qa-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 13px 16px;
  border-radius: 8px;
  background: rgba(241, 245, 249, 0.5);
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(241, 245, 249, 0.9);
  }

  &__icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: #0f172b;
  }

  &__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #0f172b;
    white-space: nowrap;
  }
}
</style>
