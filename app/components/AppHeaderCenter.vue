<template>
  <header class="header-center">
    <AppLogo />
  </header>
</template>

<style lang="scss" scoped>
.header-center {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 80px;
  width: 100%;
  background: c('default');
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 100;
}
</style>
