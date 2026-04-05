<script setup lang="ts">
import type { useBrowserTabs } from '~/composables/os/useBrowserTabs'
import { useWifiState } from '~/composables/os/useWifiState'

const { vpnEnabled } = useWifiState()

const { activeTab, canGoBack, canGoForward, navigateTo, goBack, goForward } = inject(
  'browserTabs'
) as ReturnType<typeof useBrowserTabs>

const inputUrl = ref('')

watchEffect(() => {
  if (activeTab.value) {
    inputUrl.value = activeTab.value.url
  }
})

const urlProtocol = computed(() => {
  const url = activeTab.value?.url ?? ''
  if (url.startsWith('https://')) return 'https'
  if (url.startsWith('http://')) return 'http'
  return null
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

    <!-- Индикатор безопасности -->
    <div
      v-if="urlProtocol === 'http'"
      class="browser-addressbar__security browser-addressbar__security--insecure"
      title="Соединение не защищено"
    >
      <UIcon name="i-lucide-alert-triangle" />
    </div>
    <div
      v-else-if="urlProtocol === 'https'"
      class="browser-addressbar__security browser-addressbar__security--secure"
      title="Соединение защищено"
    >
      <UIcon name="i-lucide-lock" />
    </div>

    <!-- VPN индикатор -->
    <div v-if="vpnEnabled" class="browser-addressbar__vpn" title="VPN подключён">
      <UIcon name="i-lucide-shield-check" />
      <span class="browser-addressbar__vpn-label">VPN</span>
    </div>

    <UInput
      v-model="inputUrl"
      variant="outline"
      size="sm"
      class="browser-addressbar__input"
      :class="{
        'browser-addressbar__input--insecure': urlProtocol === 'http'
      }"
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

    &--insecure input {
      background: #fef2f2;
      border-color: #fecaca;
    }
  }

  &__security {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 13px;

    &--insecure {
      color: #dc2626;
      background: #fee2e2;
    }

    &--secure {
      color: #16a34a;
      background: #dcfce7;
    }
  }

  &__star {
    flex-shrink: 0;
    color: #5f6368;
  }

  &__vpn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 2px 8px;
    border-radius: 9999px;
    background: #dbeafe;
    color: #2563eb;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }

  &__vpn-label {
    font-size: 10px;
    letter-spacing: 0.5px;
  }
}
</style>
