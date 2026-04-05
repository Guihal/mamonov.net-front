<template>
  <div class="cpf">
    <div class="cpf__field">
      <label class="cpf__label">Текущий пароль</label>
      <div class="cpf__input-wrap">
        <input
          v-model="current"
          :type="showCurrent ? 'text' : 'password'"
          class="cpf__input"
          placeholder="Введите текущий пароль"
          autocomplete="current-password"
        />
        <button class="cpf__eye" type="button" @click="showCurrent = !showCurrent">
          {{ showCurrent ? '🙈' : '👁️' }}
        </button>
      </div>
    </div>

    <div class="cpf__field">
      <label class="cpf__label">Новый пароль</label>
      <div class="cpf__input-wrap">
        <input
          v-model="next"
          :type="showNext ? 'text' : 'password'"
          class="cpf__input"
          placeholder="Придумайте новый пароль"
          autocomplete="new-password"
          @input="checkStrength"
        />
        <button class="cpf__eye" type="button" @click="showNext = !showNext">
          {{ showNext ? '🙈' : '👁️' }}
        </button>
      </div>

      <!-- Индикатор силы -->
      <div v-if="next" class="cpf__strength">
        <div class="cpf__strength-bar">
          <div
            class="cpf__strength-fill"
            :class="`cpf__strength-fill--${strength}`"
            :style="{ width: strengthPercent + '%' }"
          />
        </div>
        <span class="cpf__strength-label" :class="`cpf__strength-label--${strength}`">
          {{ strengthLabel }}
        </span>
      </div>

      <!-- Подсказки -->
      <ul v-if="next && strength !== 'strong'" class="cpf__hints">
        <li v-if="next.length < 12" :class="{ 'cpf__hint--ok': next.length >= 8 }">
          {{ next.length < 8 ? '✕' : '✓' }} Минимум 12 символов (сейчас {{ next.length }})
        </li>
        <li :class="{ 'cpf__hint--ok': /[a-zA-Zа-яА-Я]/.test(next) }">
          {{ /[a-zA-Zа-яА-Я]/.test(next) ? '✓' : '✕' }} Буквы
        </li>
        <li :class="{ 'cpf__hint--ok': /\d/.test(next) }">
          {{ /\d/.test(next) ? '✓' : '✕' }} Цифры
        </li>
        <li :class="{ 'cpf__hint--ok': /[^a-zA-Zа-яА-Я\d\s]/.test(next) }">
          {{ /[^a-zA-Zа-яА-Я\d\s]/.test(next) ? '✓' : '✕' }} Спецсимволы (!@#$%...)
        </li>
      </ul>
    </div>

    <div class="cpf__field">
      <label class="cpf__label">Повторите пароль</label>
      <input
        v-model="repeat"
        type="password"
        class="cpf__input"
        placeholder="Повторите новый пароль"
        autocomplete="new-password"
      />
      <span v-if="repeat && next !== repeat" class="cpf__mismatch">Пароли не совпадают</span>
    </div>

    <div class="cpf__actions">
      <UButton color="primary" :disabled="!canSubmit" @click="handleSubmit">Сохранить</UButton>
      <UButton color="neutral" variant="ghost" @click="$emit('dismiss')">Отмена</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { isWeakPassword } from './config'

const emit = defineEmits<{
  submit: [payload: { newPassword: string }]
  dismiss: []
}>()

const current = ref('')
const next = ref('')
const repeat = ref('')
const showCurrent = ref(false)
const showNext = ref(false)
const strength = ref<'weak' | 'normal' | 'strong'>('weak')

function checkStrength() {
  const val = next.value
  if (!val || isWeakPassword(val)) {
    strength.value = 'weak'
  } else if (
    val.length >= 12 &&
    /[a-zA-Z]/.test(val) &&
    /\d/.test(val) &&
    /[^a-zA-Z\d]/.test(val)
  ) {
    strength.value = 'strong'
  } else if (val.length >= 8 && /[a-zA-Z]/.test(val) && /\d/.test(val)) {
    strength.value = 'normal'
  } else {
    strength.value = 'weak'
  }
}

const strengthLabel = computed(() => {
  switch (strength.value) {
    case 'strong':
      return 'Надёжный'
    case 'normal':
      return 'Нормальный'
    default:
      return 'Слабый'
  }
})

const strengthPercent = computed(() => {
  switch (strength.value) {
    case 'strong':
      return 100
    case 'normal':
      return 55
    default:
      return 20
  }
})

const canSubmit = computed(() => {
  return current.value && next.value && repeat.value && next.value === repeat.value
})

function handleSubmit() {
  if (!canSubmit.value) return
  emit('submit', { newPassword: next.value })
}
</script>

<style lang="scss">
.cpf {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__label {
    font-size: 13px;
    font-weight: 500;
    color: #626d7a;
  }

  &__input-wrap {
    position: relative;
  }

  &__input {
    width: 100%;
    height: 36px;
    border: 1px solid #dce1e6;
    border-radius: 8px;
    padding: 0 36px 0 12px;
    font-size: 14px;
    background: #fff;
    outline: none;
    color: #2c2d2e;
    transition: border-color 0.2s;

    &:focus {
      border-color: #2787f5;
    }

    .cpf__input-wrap & {
      padding-right: 36px;
    }
  }

  &__eye {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 2px;
    line-height: 1;
  }

  // ── Strength bar ──
  &__strength {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 2px;
  }

  &__strength-bar {
    flex: 1;
    height: 5px;
    background: #edeef0;
    border-radius: 3px;
    overflow: hidden;
  }

  &__strength-fill {
    height: 100%;
    border-radius: 3px;
    transition:
      width 0.3s,
      background 0.3s;

    &--weak {
      background: #e64646;
    }
    &--normal {
      background: #ffa000;
    }
    &--strong {
      background: #4bb34b;
    }
  }

  &__strength-label {
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;

    &--weak {
      color: #e64646;
    }
    &--normal {
      color: #ffa000;
    }
    &--strong {
      color: #4bb34b;
    }
  }

  // ── Hints ──
  &__hints {
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
    font-size: 12px;
    color: #939cb0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__hint--ok {
    color: #4bb34b;
  }

  &__mismatch {
    font-size: 12px;
    color: #e64646;
  }

  &__actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding-top: 4px;
  }
}
</style>
