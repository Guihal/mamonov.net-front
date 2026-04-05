<template>
  <div class="hp-bar">
    <span class="hp-bar__label">HP</span>
    <div class="hp-bar__hearts">
      <UIcon
        v-for="i in userStore.maxHp"
        :key="i"
        name="i-lucide-heart"
        :class="[
          'hp-bar__heart',
          i <= userStore.hp ? 'hp-bar__heart--full' : 'hp-bar__heart--empty'
        ]"
      />
    </div>
    <span class="hp-bar__count">{{ userStore.hp }} / {{ userStore.maxHp }}</span>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
</script>

<style lang="scss">
.hp-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hp-bar__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hp-bar__hearts {
  display: flex;
  gap: 4px;
}

.hp-bar__heart {
  width: 20px;
  height: 20px;
  transition: color 0.2s ease;

  &--full {
    color: #ef4444;
  }

  &--empty {
    color: #e2e8f0;
  }
}

.hp-bar__count {
  font-size: 0.75rem;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}
</style>
