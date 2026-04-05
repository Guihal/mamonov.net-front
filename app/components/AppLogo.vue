<template>
  <NuxtLink to="/" class="logo">
    <span class="logo__black">МАМОНТОВ.</span><span class="logo__purple">нет</span>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.logo {
  text-decoration: none;
  display: inline-flex;
  align-items: baseline;
  font-family: 'PixCyrillic', sans-serif;

  &__black,
  &__purple {
    font-weight: 500;
    font-size: 40px;
    line-height: 100%;
    letter-spacing: -0.07em;
  }

  &__black {
    color: #000;
    text-transform: uppercase;
  }

  &__purple {
    color: #a57ce9;
  }
}
</style>
