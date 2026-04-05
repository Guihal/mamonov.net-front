<script setup lang="ts">
import type { useBrowserTabs } from '~/composables/os/useBrowserTabs'

const { activeTab, canGoBack, canGoForward, navigateTo, goBack, goForward } = inject(
  'browserTabs'
) as ReturnType<typeof useBrowserTabs>

const inputUrl = ref('')

watchEffect(() => {
  if (activeTab.value) {
    inputUrl.value = activeTab.value.url
  }
})

function onSubmit() {
  const url = inputUrl.value.trim()
  if (url) navigateTo(url)
}
</script>

<template>
  <div class="browser-addressbar">
    <div class="browser-addressbar__nav">
      <UButton
        variant="ghost"
        size="xs"
        icon="i-lucide-arrow-left"
        :disabled="!canGoBack"
        @click="goBack()"
      />
      <UButton
        variant="ghost"
        size="xs"
        icon="i-lucide-arrow-right"
        :disabled="!canGoForward"
        @click="goForward()"
      />
      <UButton
        variant="ghost"
        size="xs"
        icon="i-lucide-rotate-cw"
        @click="navigateTo(activeTab?.url ?? '')"
      />
    </div>
    <UInput
      v-model="inputUrl"
      variant="outline"
      size="sm"
      class="browser-addressbar__input"
      @keydown.enter="onSubmit"
    />
    <UButton variant="ghost" size="xs" icon="i-lucide-star" class="browser-addressbar__star" />
  </div>
</template>

<style lang="scss">
.browser-addressbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #ffffff;
  flex-shrink: 0;

  &__nav {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  &__input {
    flex: 1;
    min-width: 0;

    input {
      border-radius: 9999px;
      background: #f1f3f4;
      font-size: 12px;
    }
  }

  &__star {
    flex-shrink: 0;
    color: #5f6368;
  }
}
</style>
