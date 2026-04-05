<template>
  <div class="router-panel">
    <h2 class="text-xl font-bold mb-4">Панель управления роутером</h2>
    <div class="mb-6">
      <p>
        Версия прошивки: <b>{{ firmwareVersion }}</b>
      </p>
      <p>
        Статус: <span :class="statusClass">{{ statusText }}</span>
      </p>
    </div>
    <UButton :disabled="updating" @click="checkUpdate" color="primary" size="lg" class="mb-2">
      Проверить обновления
    </UButton>
    <div v-if="showSuccess" class="mt-4 text-green-600">
      Обновление установлено! Прошивка актуальна.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const firmwareVersion = ref('1.0.3')
const updating = ref(false)
const showSuccess = ref(false)
const statusText = ref('Всё в порядке')
const statusClass = ref('text-green-600')

function checkUpdate() {
  updating.value = true
  statusText.value = 'Проверка обновлений...'
  statusClass.value = 'text-blue-600'
  setTimeout(() => {
    firmwareVersion.value = '1.0.4'
    statusText.value = 'Обновление установлено!'
    statusClass.value = 'text-green-600'
    showSuccess.value = true
    updating.value = false
    // emit событие для завершения урока
    // @ts-ignore
    if (typeof defineEmits === 'function') {
      const emit = defineEmits(['onRouterUpdate'])
      emit('onRouterUpdate')
    }
  }, 1200)
}
</script>

<style scoped>
.router-panel {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.07);
  text-align: center;
}
</style>
