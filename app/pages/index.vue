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
        </div>
      </div>

      <!-- Scattered badges -->
      <UBadge class="landing__badge landing__badge--1" color="success" variant="solid" size="lg">
        Двухфакторная аутентификация
      </UBadge>
      <UBadge class="landing__badge landing__badge--2" color="success" variant="solid" size="lg">
        Firewall
      </UBadge>
      <UBadge class="landing__badge landing__badge--3" color="success" variant="solid" size="lg">
        DLP
      </UBadge>
      <UBadge class="landing__badge landing__badge--4" color="success" variant="solid" size="lg">
        Zero Trust
      </UBadge>
      <UBadge class="landing__badge landing__badge--5" color="success" variant="solid" size="lg">
        Шифрование данных
      </UBadge>
    </div>

    <!-- CTA button -->
    <UButton :to="ctaTo" color="neutral" size="xl" block class="landing__cta">
      Начать игру
    </UButton>
  </div>
</template>

<style lang="scss" scoped>
.landing {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__hero {
    position: relative;
    background: #f1f1f1;
    border-radius: 20px;
    padding: 80px 60px 60px;
    min-height: 420px;
    overflow: hidden;
  }

  &__heading {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  &__title {
    font-size: 100px;
    font-weight: 500;
    line-height: 74px;
    letter-spacing: -0.05em;
    color: var(--color-neutral-900);
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
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
      top: 40px;
      left: 40px;
    }

    &--2 {
      top: 30px;
      left: 45%;
    }

    &--3 {
      top: 50px;
      right: 30%;
    }

    &--4 {
      bottom: 60px;
      left: 60px;
    }

    &--5 {
      bottom: 40px;
      left: 35%;
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
