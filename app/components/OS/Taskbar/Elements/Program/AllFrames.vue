<script setup lang="ts">
import type { WindowOb } from '~/components/OS/Window/Window'

const { windowObs } = defineProps<{
  windowObs: WindowOb[]
}>()
</script>

<template>
  <TransitionGroup>
    <template v-for="windowOb in windowObs" :key="windowOb.id">
      <OSTaskbarElementsProgramFrame :windowOb="windowOb" />
    </template>
  </TransitionGroup>
</template>

<style lang="scss"></style>
