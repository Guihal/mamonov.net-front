<script setup lang="ts">
import type { BrowserEvents } from '~/types/programs'

const browserEvents = inject<BrowserEvents>('browserEvents', {})
const url = 'http://mybank-online.ru'

const login = ref('')
const password = ref('')

function onSubmit() {
  browserEvents.onFormSubmit?.(url, { login: login.value, password: password.value })
}
</script>

<template>
  <div class="bank-page bank-page--http">
    <header class="bank-page__header">
      <div class="bank-page__logo">
        <UIcon name="i-lucide-building-2" class="bank-page__logo-icon" />
        <span>МойБанк</span>
      </div>
    </header>

    <main class="bank-page__main">
      <div class="bank-page__card">
        <h1 class="bank-page__title">Вход в личный кабинет</h1>
        <p class="bank-page__subtitle">Интернет-банкинг «МойБанк»</p>

        <form class="bank-page__form" @submit.prevent="onSubmit">
          <div class="bank-page__field">
            <label class="bank-page__label">Логин</label>
            <UInput v-model="login" placeholder="Введите логин" size="lg" block />
          </div>
          <div class="bank-page__field">
            <label class="bank-page__label">Пароль</label>
            <UInput
              v-model="password"
              type="password"
              placeholder="Введите пароль"
              size="lg"
              block
            />
          </div>
          <UButton type="submit" color="primary" size="lg" block> Войти </UButton>
        </form>

        <div class="bank-page__links">
          <a href="#" class="bank-page__link">Забыли пароль?</a>
          <a href="#" class="bank-page__link">Регистрация</a>
        </div>
      </div>
    </main>

    <footer class="bank-page__footer">
      <div class="bank-page__insecure-badge">
        <UIcon name="i-lucide-alert-triangle" />
        <span>Соединение не защищено (HTTP)</span>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.bank-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #f1f5f9;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    background: #1e40af;
    color: #fff;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 700;
  }

  &__logo-icon {
    font-size: 24px;
  }

  &__main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  &__card {
    background: #fff;
    border-radius: 16px;
    padding: 40px 32px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  }

  &__title {
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    text-align: center;
    margin: 0 0 4px;
  }

  &__subtitle {
    font-size: 13px;
    color: #94a3b8;
    text-align: center;
    margin: 0 0 28px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__label {
    font-size: 13px;
    font-weight: 500;
    color: #334155;
  }

  &__links {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  &__link {
    font-size: 13px;
    color: #3b82f6;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__footer {
    padding: 10px 24px;
    background: #fff;
    border-top: 1px solid #e2e8f0;
  }

  &__insecure-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #dc2626;
    font-weight: 500;
  }
}
</style>
