<script setup lang="ts">
import type { useBrowserTabs } from '~/composables/os/useBrowserTabs'

const { navigateTo } = inject('browserTabs') as ReturnType<typeof useBrowserTabs>

const connectionInfo = {
  ssid: 'Airport_Free_WiFi_5G',
  macAddress: 'AA:BB:CC:11:22:33',
  gateway: '10.0.0.1',
  dhcp: '10.0.0.50',
  dns: '10.0.0.1',
  ipAddress: '10.0.0.87',
  subnetMask: '255.255.255.0',
  signalStrength: '-42 dBm',
  linkSpeed: '72 Mbps',
  security: 'Открытая'
}

function goBack() {
  navigateTo('network://wifi-selector')
}
</script>

<template>
  <div class="network-info">
    <header class="network-info__header">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563eb"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <h1 class="network-info__title">Информация о подключении</h1>
    </header>

    <div class="network-info__content">
      <div class="network-info__warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f59e0b"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span
          >Сотрудники аэропорта подтверждают, что официальная сеть —
          <strong>Airport_Free_WiFi</strong> (без суффикса 5G)</span
        >
      </div>

      <div class="network-info__section">
        <h2 class="network-info__section-title">Текущее подключение</h2>
        <div class="network-info__grid">
          <div class="network-info__field">
            <span class="network-info__label">Сеть (SSID)</span>
            <span class="network-info__value network-info__value--danger">{{
              connectionInfo.ssid
            }}</span>
          </div>
          <div class="network-info__field">
            <span class="network-info__label">MAC-адрес роутера</span>
            <span class="network-info__value">{{ connectionInfo.macAddress }}</span>
          </div>
          <div class="network-info__field">
            <span class="network-info__label">IP-адрес</span>
            <span class="network-info__value">{{ connectionInfo.ipAddress }}</span>
          </div>
          <div class="network-info__field">
            <span class="network-info__label">Маска подсети</span>
            <span class="network-info__value">{{ connectionInfo.subnetMask }}</span>
          </div>
          <div class="network-info__field">
            <span class="network-info__label">Шлюз</span>
            <span class="network-info__value">{{ connectionInfo.gateway }}</span>
          </div>
          <div class="network-info__field">
            <span class="network-info__label">DHCP-сервер</span>
            <span class="network-info__value">{{ connectionInfo.dhcp }}</span>
          </div>
          <div class="network-info__field">
            <span class="network-info__label">DNS</span>
            <span class="network-info__value">{{ connectionInfo.dns }}</span>
          </div>
          <div class="network-info__field">
            <span class="network-info__label">Сила сигнала</span>
            <span class="network-info__value">{{ connectionInfo.signalStrength }}</span>
          </div>
          <div class="network-info__field">
            <span class="network-info__label">Скорость</span>
            <span class="network-info__value">{{ connectionInfo.linkSpeed }}</span>
          </div>
          <div class="network-info__field">
            <span class="network-info__label">Безопасность</span>
            <span class="network-info__value">{{ connectionInfo.security }}</span>
          </div>
        </div>
      </div>
    </div>

    <footer class="network-info__footer">
      <UButton variant="ghost" size="sm" icon="i-lucide-arrow-left" @click="goBack">
        Назад к списку сетей
      </UButton>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.network-info {
  background: #fff;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  &__header {
    background: #2563eb;
    color: #fff;
    padding: 1.25rem 1rem;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      stroke: #fff;
      flex-shrink: 0;
    }
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }

  &__content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }

  &__warning {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: #fef3c7;
    border: 1px solid #fbbf24;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin-bottom: 1.25rem;
    font-size: 0.875rem;
    color: #92400e;
    line-height: 1.4;

    svg {
      flex-shrink: 0;
      margin-top: 1px;
    }
  }

  &__section {
    margin-bottom: 1rem;

    &-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem 1.5rem;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3f4f6;
  }

  &__label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }

  &__value {
    font-size: 0.875rem;
    color: #111827;
    font-family: 'SF Mono', 'Fira Code', monospace;

    &--danger {
      color: #dc2626;
      font-weight: 600;
    }
  }

  &__footer {
    padding: 0.5rem 1rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
  }
}
</style>
