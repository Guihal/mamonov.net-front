<script setup lang="ts">
import OsWindow from './index.vue' // Получаем реактивное хранилище всех окон (Record<string, WindowOb>)
const { allWindows } = useAllWindows()
</script>
<template>
  <!-- Анимированный список окон (добавление/удаление с transition) -->
  <TransitionGroup name="window">
    <OsWindow v-for="windowOb in allWindows" :windowOb="windowOb" :key="windowOb.id" />
  </TransitionGroup>
</template>
<style lang="scss"></style>
