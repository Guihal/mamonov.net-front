<script setup lang="ts">
import type { useBrowserTabs } from '~/composables/os/useBrowserTabs'

const { navigateTo } = inject('browserTabs') as ReturnType<typeof useBrowserTabs>

interface WifiNetwork {
  ssid: string
  signalLevel: number // 0-4
  isSecured: boolean
  isConnected: boolean
}

const networks = ref<WifiNetwork[]>([
  {
    ssid: 'Airport_Free_WiFi_5G',
    signalLevel: 4,
    isSecured: false,
    isConnected: true
  },
  {
    ssid: 'Airport_Free_WiFi',
    signalLevel: 3,
    isSecured: false,
    isConnected: false
  },
  {
    ssid: 'Airport_Staff_Internal',
    signalLevel: 2,
    isSecured: true,
    isConnected: false
  },
  {
    ssid: 'VIP_Lounge_WiFi',
    signalLevel: 1,
    isSecured: true,
    isConnected: false
  }
])

function getSignalBars(level: number): boolean[] {
  return [1, 2, 3, 4].map((i) => i <= level)
}

function goToConnectionInfo() {
  navigateTo('network://connection-info')
}
</script>

<template>
  <div class="wifi-selector">
    <header class="wifi-selector__header">
      <div class="wifi-selector__header-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2563eb"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>
      <h1 class="wifi-selector__title">Выбор сети Wi-Fi</h1>
      <p class="wifi-selector__subtitle">Аэропорт «Внуково» — Зал ожидания</p>
    </header>

    <div class="wifi-selector__actions">
      <UButton variant="ghost" size="sm" icon="i-lucide-info" @click="goToConnectionInfo">
        Информация о подключении
      </UButton>
    </div>

    <div class="wifi-selector__list">
      <div
        v-for="network in networks"
        :key="network.ssid"
        class="wifi-network"
        :class="{ 'wifi-network--connected': network.isConnected }"
      >
        <div class="wifi-network__left">
          <div class="wifi-network__signal">
            <div
              v-for="(active, idx) in getSignalBars(network.signalLevel)"
              :key="idx"
              class="wifi-network__bar"
              :class="{
                'wifi-network__bar--active': active,
                'wifi-network__bar--inactive': !active
              }"
            />
          </div>
          <div class="wifi-network__lock">
            <svg
              v-if="network.isSecured"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
        <div class="wifi-network__info">
          <span class="wifi-network__ssid">{{ network.ssid }}</span>
          <span v-if="network.isConnected" class="wifi-network__status">Подключено</span>
        </div>
      </div>
    </div>

    <footer class="wifi-selector__footer">
      <p class="wifi-selector__hint">
        Нажмите на сеть для подключения или проверьте текущее подключение
      </p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.wifi-selector {
  background: #fff;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  &__header {
    background: #2563eb;
    color: #fff;
    padding: 1.5rem 1rem 1rem;
    text-align: center;

    &-icon {
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: center;

      svg {
        stroke: #fff;
      }
    }
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  &__subtitle {
    font-size: 0.875rem;
    opacity: 0.85;
    margin: 0.25rem 0 0;
  }

  &__actions {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
  }

  &__list {
    flex: 1;
    padding: 0.5rem 0;
  }

  &__footer {
    padding: 0.75rem 1rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  &__hint {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
    text-align: center;
  }
}

.wifi-network {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s;

  &:hover {
    background: #f9fafb;
  }

  &--connected {
    background: #eff6ff;
    border-left: 3px solid #2563eb;

    &:hover {
      background: #dbeafe;
    }
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__signal {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 18px;
  }

  &__bar {
    width: 4px;
    border-radius: 1px;

    &--active {
      background: #2563eb;
    }

    &--inactive {
      background: #d1d5db;
    }

    &:nth-child(1) {
      height: 5px;
    }
    &:nth-child(2) {
      height: 9px;
    }
    &:nth-child(3) {
      height: 13px;
    }
    &:nth-child(4) {
      height: 18px;
    }
  }

  &__lock {
    color: #6b7280;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__ssid {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__status {
    font-size: 0.75rem;
    color: #2563eb;
    font-weight: 500;
  }
}
</style>
