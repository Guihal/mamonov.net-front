<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, FormErrorEvent } from '@nuxt/ui'
import { useAuth } from '~/composables/auth/useAuth'

definePageMeta({
  layout: 'default'
})

const schema = z.object({
  email: z.email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

const { login, pending, error } = useAuth()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await login(event.data.email, event.data.password)
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-page__container">
      <NuxtLink to="/" class="auth-page__logo">
        <span class="auth-page__logo-name">Мамонтов</span>
        <span class="auth-page__logo-dot">.</span>
        <span class="auth-page__logo-net">нет</span>
      </NuxtLink>

      <UCard class="auth-page__card">
        <template #header>
          <h2 class="text-lg font-medium text-center">Вход</h2>
        </template>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
          @error="onError"
        >
          <UFormField label="Email" name="email">
            <UInput
              v-model="state.email"
              type="email"
              placeholder="you@example.com"
              icon="i-lucide-mail"
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Пароль" name="password">
            <UInput
              v-model="state.password"
              type="password"
              placeholder="Введите пароль"
              icon="i-lucide-lock"
              autocomplete="current-password"
              class="w-full"
            />
          </UFormField>

          <p v-if="error" class="text-sm text-red-500">
            {{ error.message }}
          </p>

          <UButton type="submit" color="neutral" block :loading="pending"> Войти </UButton>
        </UForm>

        <template #footer>
          <p class="text-sm text-center text-gray-500">
            Нет аккаунта?
            <NuxtLink to="/app/auth/registration" class="text-violet-500 hover:underline">
              Зарегистрируйтесь
            </NuxtLink>
          </p>
        </template>
      </UCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  padding: 20px;

  &__container {
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  &__logo {
    text-decoration: none;
    font-size: 40px;
    font-weight: 500;
    line-height: 1;
  }

  &__logo-name {
    color: #ff8000;
  }

  &__logo-dot {
    color: #000;
  }

  &__logo-net {
    color: #a57ce9;
  }

  &__card {
    width: 100%;
  }
}
</style>
