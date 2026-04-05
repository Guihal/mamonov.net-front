<template>
  <UApp>
    <AppHeaderCenter />

    <UMain>
      <slot />
    </UMain>

    <!-- Sponsor footer -->
    <div class="sponsor">
      <span class="sponsor__name">СТРЕПСИЛС</span>
      <span class="sponsor__x">×</span>
      <img src="/img/ci-logo.png" alt="Центр-Инвест" class="sponsor__logo" />
    </div>
  </UApp>
</template>

<style lang="scss" scoped>
.sponsor {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 0 24px;

  &__name {
    font-size: 20px;
    font-weight: 900;
    color: var(--color-neutral-900);
    letter-spacing: 0.5px;
  }

  &__x {
    font-size: 20px;
    font-weight: 500;
    color: var(--color-neutral-900);
  }

  &__logo {
    height: 32px;
    object-fit: contain;
  }
}
</style>
