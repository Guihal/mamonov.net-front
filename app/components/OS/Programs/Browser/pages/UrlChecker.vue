<script setup lang="ts">
import type { BrowserEvents } from '~/types/programs'

const browserEvents = inject<BrowserEvents>('browserEvents', {})

/** Дополнительные паттерны из конфига урока (provide('urlCheckerPatterns', [...])) */
const extraPatterns = inject<RegExp[]>('urlCheckerPatterns', [])

const url = ref('')
const checked = ref(false)
const isSafe = ref(true)

const SUSPICIOUS_PATTERNS: RegExp[] = [
  /phishing/i,
  /fake/i,
  /malware/i,
  /evil/i,
  /hack/i,
  /\.ru\.com/i,
  /free-money/i,
  /login-verify/i,
  /update-flash-now/i,
  /bit\.ly/i,
  /tinyurl/i,
  // Wi-Fi уроки
  /airport-wifi-update/i,
  /mall-free-wifi-auth/i,
  /update-router-now/i,
  /domru-update/i,
  // Офисные уроки
  /corp-portall/i,
  /corp-hr-update/i,
  // Общие эвристики
  /-update\.(ru|com|net)/i,
  /\/confirm\b/i,
  /\/email-confirm\b/i
]

function checkUrl() {
  const input = url.value.trim()
  if (!input) return

  checked.value = true
  const allPatterns = [...SUSPICIOUS_PATTERNS, ...extraPatterns]
  isSafe.value = !allPatterns.some((p) => p.test(input))
  browserEvents.onFormSubmit?.('tools://url-checker', { url: input })
}
</script>

<template>
  <div class="url-checker">
    <div class="url-checker__content">
      <h2 class="url-checker__title">
        <UIcon name="i-lucide-shield-check" class="url-checker__title-icon" />
        Проверка URL
      </h2>
      <p class="url-checker__desc">Введите ссылку для проверки на безопасность</p>
      <div class="url-checker__form">
        <UInput
          v-model="url"
          size="lg"
          placeholder="https://example.com"
          class="url-checker__input"
          @keydown.enter="checkUrl"
        />
        <UButton size="lg" @click="checkUrl"> Проверить </UButton>
      </div>
      <div
        v-if="checked"
        class="url-checker__result"
        :class="isSafe ? 'url-checker__result--safe' : 'url-checker__result--danger'"
      >
        <UIcon :name="isSafe ? 'i-lucide-check-circle' : 'i-lucide-alert-triangle'" />
        <span>{{ isSafe ? 'Ссылка безопасна' : 'Подозрительная ссылка!' }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.url-checker {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px;
    max-width: 500px;
    width: 100%;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title-icon {
    color: #22c55e;
  }

  &__desc {
    color: #6b7280;
    font-size: 14px;
  }

  &__form {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  &__input {
    flex: 1;
  }

  &__result {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    width: 100%;
    justify-content: center;

    &--safe {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    &--danger {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
  }
}
</style>
