<script setup lang="ts">
import type { useBrowserTabs } from '~/composables/os/useBrowserTabs'
import type { useBrowserSites } from '~/composables/os/useBrowserSites'

const { activeTab } = inject('browserTabs') as ReturnType<typeof useBrowserTabs>
const sites = inject('browserSites') as ReturnType<typeof useBrowserSites>

const resolvedSite = computed(() => {
  if (!activeTab.value) return null
  return sites.resolve(activeTab.value.url)
})

const isExternalUrl = computed(() => {
  if (!activeTab.value) return false
  const url = activeTab.value.url
  return url.startsWith('http://') || url.startsWith('https://')
})
</script>

<template>
  <div class="browser-pageview">
    <template v-if="activeTab">
      <component :is="resolvedSite.component" v-if="resolvedSite" :key="activeTab.url" />
      <iframe
        v-else-if="isExternalUrl"
        :src="activeTab.url"
        sandbox="allow-scripts allow-same-origin"
        class="browser-pageview__iframe"
      />
      <div v-else class="browser-pageview__empty">
        <p class="text-gray-400 text-sm">Страница не найдена: {{ activeTab.url }}</p>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.browser-pageview {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #ffffff;
  display: flex;
  flex-direction: column;

  &__iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
