<template>
  <div class="captive-portal">
    <header class="portal-header">
      <div class="portal-header__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>
      <h1 class="portal-header__title">Бесплатный Wi-Fi</h1>
      <p class="portal-header__subtitle">ТЦ «МегаМолл»</p>
    </header>

    <main class="portal-main">
      <p class="portal-main__welcome">Для подключения к интернету войдите одним из способов:</p>

      <div class="portal-main__buttons">
        <button class="social-btn social-btn--vk" @click="showVkForm = true">
          <svg
            class="social-btn__icon"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.366 1.258 2.18 1.814.616.42 1.084.328 1.084.328l2.178-.03s1.14-.07.599-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.264-1.183-1.06.462-3.246.999-1.33 1.398-2.142 1.273-2.49-.12-.332-.858-.244-.858-.244l-2.45.015s-.182-.025-.316.056c-.132.079-.216.263-.216.263s-.389 1.036-.907 1.917c-1.094 1.862-1.532 1.96-1.71 1.844-.415-.27-.311-1.085-.311-1.664 0-1.808.274-2.562-.534-2.758-.268-.065-.465-.108-1.15-.115-.879-.009-1.623.003-2.043.209-.28.137-.495.442-.364.46.163.02.53.099.725.364.252.343.243 1.113.243 1.113s.145 2.13-.337 2.394c-.332.18-.786-.188-1.762-1.87-.5-.862-.877-1.815-.877-1.815s-.073-.178-.203-.273c-.157-.116-.377-.152-.377-.152l-2.327.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.83 4.282 3.904 6.44c1.9 1.978 4.057 1.848 4.057 1.848h.978z"
            />
          </svg>
          <span>Войти через ВКонтакте</span>
        </button>

        <button class="social-btn social-btn--google" @click="showGoogleForm = true">
          <svg
            class="social-btn__icon"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Войти через Google</span>
        </button>
      </div>

      <div class="portal-divider">
        <span class="portal-divider__line" />
        <span class="portal-divider__text">или</span>
        <span class="portal-divider__line" />
      </div>

      <form class="email-form" @submit.prevent="onEmailSubmit">
        <div class="email-form__field">
          <label class="email-form__label">Email</label>
          <input
            v-model="email"
            class="email-form__input"
            type="email"
            placeholder="example@mail.ru"
            required
          />
        </div>
        <div class="email-form__field">
          <label class="email-form__label">Пароль</label>
          <input
            v-model="password"
            class="email-form__input"
            type="password"
            placeholder="Введите пароль"
            required
          />
        </div>
        <button type="submit" class="email-form__submit">Подключиться</button>
      </form>
    </main>

    <footer class="portal-footer">
      <p class="portal-footer__terms">
        Нажимая «Подключиться», вы принимаете
        <a href="#">условия использования</a>
      </p>
      <small class="portal-footer__domain">mall-free-wifi-auth.ru</small>
    </footer>

    <!-- VK modal -->
    <UModal
      v-model:open="showVkForm"
      title="Вход через ВКонтакте"
      description="Введите данные от аккаунта VK"
    >
      <template #body>
        <form class="modal-form" @submit.prevent="onVkSubmit">
          <div class="modal-form__field">
            <label class="modal-form__label">Логин или телефон</label>
            <input
              v-model="vkLogin"
              class="modal-form__input"
              placeholder="Email, логин или телефон"
              required
            />
          </div>
          <div class="modal-form__field">
            <label class="modal-form__label">Пароль</label>
            <input
              v-model="vkPassword"
              class="modal-form__input"
              type="password"
              placeholder="Введите пароль"
              required
            />
          </div>
          <button type="submit" class="modal-form__submit modal-form__submit--vk">Войти</button>
        </form>
      </template>
    </UModal>

    <!-- Google modal -->
    <UModal
      v-model:open="showGoogleForm"
      title="Вход через Google"
      description="Введите данные Google-аккаунта"
    >
      <template #body>
        <form class="modal-form" @submit.prevent="onGoogleSubmit">
          <div class="modal-form__field">
            <label class="modal-form__label">Email</label>
            <input
              v-model="googleEmail"
              class="modal-form__input"
              type="email"
              placeholder="you@gmail.com"
              required
            />
          </div>
          <div class="modal-form__field">
            <label class="modal-form__label">Пароль</label>
            <input
              v-model="googlePassword"
              class="modal-form__input"
              type="password"
              placeholder="Введите пароль"
              required
            />
          </div>
          <button type="submit" class="modal-form__submit modal-form__submit--google">Войти</button>
        </form>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import type { BrowserEvents } from '~/types/programs'

const showVkForm = ref(false)
const showGoogleForm = ref(false)
const email = ref('')
const password = ref('')
const vkLogin = ref('')
const vkPassword = ref('')
const googleEmail = ref('')
const googlePassword = ref('')

const browserEvents = inject<BrowserEvents>('browserEvents', {})
const url = 'captive://mall-wifi'

function onEmailSubmit() {
  browserEvents.onFormSubmit?.(url, { email: email.value, password: password.value })
}
function onVkSubmit() {
  showVkForm.value = false
  browserEvents.onFormSubmit?.(url, { vkLogin: vkLogin.value, vkPassword: vkPassword.value })
}
function onGoogleSubmit() {
  showGoogleForm.value = false
  browserEvents.onFormSubmit?.(url, {
    googleEmail: googleEmail.value,
    googlePassword: googlePassword.value
  })
}
</script>

<style lang="scss" scoped>
.captive-portal {
  background: #f5f7fa;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.portal-header {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: #fff;
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;

  &__icon {
    display: flex;
    justify-content: center;
    margin-bottom: 0.75rem;
  }

  &__title {
    font-size: 1.375rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.01em;
  }

  &__subtitle {
    font-size: 0.875rem;
    opacity: 0.85;
    margin: 0.25rem 0 0;
    font-weight: 400;
  }
}

.portal-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1.25rem;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;

  &__welcome {
    font-size: 0.875rem;
    color: #4b5563;
    text-align: center;
    margin: 0 0 1.25rem;
    line-height: 1.5;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    width: 100%;
  }
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  font-family: inherit;

  &__icon {
    flex-shrink: 0;
  }

  &--vk {
    background: #0077ff;
    color: #fff;

    &:hover {
      background: #0066dd;
    }
  }

  &--google {
    background: #fff;
    color: #3c4043;
    border: 1px solid #dadce0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

    &:hover {
      background: #f8f9fa;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
    }
  }
}

.portal-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin: 1.25rem 0;

  &__line {
    flex: 1;
    height: 1px;
    background: #d1d5db;
  }

  &__text {
    font-size: 0.8125rem;
    color: #9ca3af;
    text-transform: lowercase;
  }
}

.email-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #374151;
  }

  &__input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    font-family: inherit;
    background: #fff;
    color: #111827;
    transition: border-color 0.15s;
    outline: none;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
    }
  }

  &__submit {
    width: 100%;
    padding: 0.75rem;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s;
    font-family: inherit;
    margin-top: 0.25rem;

    &:hover {
      background: #1d4ed8;
    }
  }
}

.portal-footer {
  text-align: center;
  padding: 1rem 1.25rem 0.75rem;
  border-top: 1px solid #e5e7eb;
  background: #fff;

  &__terms {
    font-size: 0.75rem;
    color: #9ca3af;
    margin: 0 0 0.5rem;

    a {
      color: #3b82f6;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__domain {
    display: block;
    font-size: 0.6875rem;
    color: #b0b7c3;
    user-select: text;
    letter-spacing: 0.02em;
  }
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #374151;
  }

  &__input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    font-family: inherit;
    background: #fff;
    color: #111827;
    outline: none;
    transition: border-color 0.15s;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
    }
  }

  &__submit {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s;
    font-family: inherit;
    color: #fff;

    &--vk {
      background: #0077ff;

      &:hover {
        background: #0066dd;
      }
    }

    &--google {
      background: #4285f4;

      &:hover {
        background: #3367d6;
      }
    }
  }
}
</style>
