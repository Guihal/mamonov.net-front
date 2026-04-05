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
    </div>
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

@media (max-width: 768px) {
  .landing {
    padding: 32px 16px;

    &__hero {
      min-height: auto;
    }

    &__heading {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      &-text {
        max-width: 100%;
      }
    }

    &__title {
      font-size: 56px;
      padding-right: 0;
    }

    &__footer {
      flex-direction: column;
      align-items: center;

      &-title {
        font-size: 56px;
        margin-bottom: 24px;
        text-align: center;
      }

      &-wrapper {
        width: 100%;
      }
    }

    &__mascot {
      width: 100%;
      max-width: 300px;
      height: auto;
      aspect-ratio: 405 / 271;
    }
  }
}

@media (max-width: 480px) {
  .landing {
    padding: 24px 12px;

    &__title {
      font-size: 40px;
    }

    &__footer-title {
      font-size: 40px;
    }
  }
}
</style>
