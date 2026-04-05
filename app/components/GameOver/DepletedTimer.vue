<template>
  <div class="depleted-timer">
    <template v-if="timeStr">
      <UIcon name="i-lucide-clock" class="depleted-timer__icon" />
      <span class="depleted-timer__label">Восстановление через</span>
      <span class="depleted-timer__value">{{ timeStr }}</span>
    </template>
    <template v-else>
      <span class="depleted-timer__label">HP восстановлены! Перезагрузите страницу.</span>
    </template>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

const timeStr = computed(() => {
  const ms = userStore.timeUntilRestore
  if (ms === null || ms <= 0) return null

  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  intervalId = setInterval(() => {
    userStore.tickTimer()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId !== null) clearInterval(intervalId)
})
</script>

<style lang="scss">
.depleted-timer {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 8px 14px;
}

.depleted-timer__icon {
  width: 16px;
  height: 16px;
  color: #f59e0b;
  flex-shrink: 0;
}

.depleted-timer__label {
  font-size: 0.8125rem;
  color: #92400e;
}

.depleted-timer__value {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #b45309;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}
</style>
