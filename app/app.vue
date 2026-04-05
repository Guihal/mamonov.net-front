<script setup lang="ts">
const colorMode = useColorMode()
colorMode.preference = 'light'

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'ru'
  }
})

useSeoMeta({
  title: 'Мамонтов.нет — учебная платформа по кибербезопасности',
  description: 'Обучайтесь кибербезопасности в формате интерактивных симуляций',
  ogTitle: 'Мамонтов.нет',
  ogDescription: 'Обучайтесь кибербезопасности в формате интерактивных симуляций'
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
