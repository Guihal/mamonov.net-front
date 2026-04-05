<script setup lang="ts">
import type { QuickAction } from '~/types/lesson'

defineProps<{
  actions: QuickAction[]
}>()
</script>

<template>
  <div class="qa-menu">
    <OSQuickActionsActionItem v-for="action in actions" :key="action.id" :action="action" />
  </div>
</template>

<style lang="scss">
.qa-menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  min-width: 216px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 0 8px 8px 0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}
</style>
