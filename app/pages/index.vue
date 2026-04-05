<script setup lang="ts">
import { useMascotStore } from '~/composables/mascot/useMascotStore'
import { useUser } from '~/composables/user/useUser'

definePageMeta({ layout: 'default' })

const mascot = useMascotStore()
const userStore = useUser()

const ctaTo = computed(() => (userStore.isAurhorized ? '/app' : '/app/auth/login'))

onMounted(() => {
  mascot.setVisible(true)
})
</script>

<template>
  <div class="landing">
    <div class="landing__hero">
      <div class="landing__heading">
        <h1 class="landing__title">Стань мастером</h1>
        <div class="landing__heading-text">
          Распознай фишинг, парольную атаку и социальную инженерию в симуляторе с последствиями и
          подсказками
        </div>
      </div>
      <div class="landing__footer">
        <div class="landing__mascot">
          <Elephant position="relative" />
        </div>
        <div class="landing__footer-wrapper">
          <h1 class="landing__footer-title">киберзащитЫ</h1>
          <UButton :to="ctaTo" color="neutral" size="xl" block class="landing__cta">
            Начать игру
          </UButton>
        </div>
      </div>

      <!-- Scattered badges -->
      <UBadge class="landing__badge landing__badge--1" color="success" variant="solid" size="lg">
        Двухфакторная аутентификация
      </UBadge>
      <UBadge class="landing__badge landing__badge--2" color="error" variant="solid" size="lg">
        Firewall
      </UBadge>
      <UBadge class="landing__badge landing__badge--3" color="success" variant="solid" size="lg">
        DLP
      </UBadge>
      <UBadge class="landing__badge landing__badge--4" color="success" variant="solid" size="lg">
        Cyberattack
      </UBadge>
      <UBadge class="landing__badge landing__badge--5" color="secondary" variant="solid" size="lg">
        Шифрование данных
      </UBadge>
    </div>

    <!-- CTA button -->
  </div>
</template>

<style lang="scss">
main:has(.landing) {
  min-height: 100% !important;
}

.landing {
  max-width: 1440px;
  margin: 0 auto;
  padding: 80px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__hero {
    position: relative;

    padding: 0;
    min-height: 420px;
  }

  &__footer {
    display: flex;
    gap: 20px;

    &-title {
      font-weight: 500;
      font-size: 140px;
      line-height: 80%;
      letter-spacing: -0.05em;
      color: #000;
      font-family: 'PixCyrillic', sans-serif;
      margin-bottom: 60px;
      position: relative;
    }
  }

  &__heading {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;

    &-text {
      font-weight: 500;
      font-size: 16px;
      line-height: 106%;
      color: #000;
      max-width: 320px;
    }
  }

  &__title {
    font-weight: 500;
    font-size: 140px;
    line-height: 80%;
    letter-spacing: -0.07em;
    text-align: left;
    color: var(--color-neutral-900);
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;

    padding-right: 20px;
  }

  &__title-line {
    display: block;

    &--right {
      text-align: right;
    }
  }

  // Scattered badge positions matching the design
  &__badge {
    position: absolute;
    z-index: 2;
    font-size: 14px;
    border-radius: 20px;

    &--1 {
      top: -40px;
      left: 0;
      rotate: -4.64deg;
    }

    &--2 {
      top: 0%;
      translate: -50% calc(-80%);
      left: 50%;
    }

    &--3 {
      top: 0%;
      translate: -50% calc(-80%);
      right: 19%;
      rotate: 15deg;
    }

    &--4 {
      bottom: 160px;
      right: 60%;
      rotate: -4.64deg;
    }

    &--5 {
      bottom: 160px;
      right: 60px;
      rotate: 3.64deg;
    }
  }

  &__mascot {
    width: 405px;
    height: 271px;
    flex-shrink: 0;
  }

  &__cta {
    font-size: 18px;
    padding: 14px 0;
  }
}
</style>
