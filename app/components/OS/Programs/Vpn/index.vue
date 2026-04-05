<script setup lang="ts">
import { GAME_CONTROLLER_KEY } from '~/types/game'

const ctrl = inject(GAME_CONTROLLER_KEY, null)
const isVpnEnabled = ref(false)
const isConnecting = ref(false)
const selectedServer = ref('auto')

const servers = [
  { id: 'auto', label: 'Автоматически', location: 'Лучший сервер', ping: '~20ms' },
  { id: 'nl', label: 'Нидерланды', location: 'Амстердам', ping: '~35ms' },
  { id: 'de', label: 'Германия', location: 'Франкфурт', ping: '~30ms' },
  { id: 'fi', label: 'Финляндия', location: 'Хельсинки', ping: '~25ms' }
]

function toggleVpn() {
  if (isVpnEnabled.value) {
    isVpnEnabled.value = false
    return
  }

  isConnecting.value = true
  setTimeout(() => {
    isConnecting.value = false
    isVpnEnabled.value = true

    // Уведомляем game controller о включении VPN
    const step = ctrl?.step.value ?? 0
    if (ctrl && step <= 1) {
      ctrl.mascot.clearPhrases()
      ctrl.goToStep(2)

      // Реплики маскота после включения VPN
      ctrl.mascot.enqueue([
        {
          text: 'Отлично! VPN создаёт зашифрованный туннель между тобой и сервером VPN. Даже если кто-то в кафе перехватит твои пакеты — он увидит только зашифрованную кашу.',
          emotion: 'happy'
        },
        {
          text: 'Теперь можно работать в сети. Но помни: VPN защищает трафик, а не сайт от фишинга — замок HTTPS всё равно важен.',
          emotion: 'neutral'
        }
      ])
    }
  }, 1500)
}

// Синхронизируем состояние VPN с game controller
provide('vpnState', {
  isVpnEnabled: readonly(isVpnEnabled),
  enable: () => {
    if (!isVpnEnabled.value) {
      isConnecting.value = true
      setTimeout(() => {
        isConnecting.value = false
        isVpnEnabled.value = true
      }, 1500)
    }
  },
  disable: () => {
    isVpnEnabled.value = false
  }
})
</script>

<template>
  <div class="vpn-app">
    <div class="vpn-app__header">
      <div class="vpn-app__icon">
        <UIcon name="i-lucide-shield" class="vpn-app__shield" />
      </div>
      <div class="vpn-app__title">VPN Shield</div>
    </div>

    <div class="vpn-app__body">
      <!-- Статус -->
      <div class="vpn-app__status" :class="{ 'vpn-app__status--active': isVpnEnabled }">
        <div class="vpn-app__status-indicator">
          <div class="vpn-app__dot" :class="{ 'vpn-app__dot--active': isVpnEnabled }" />
          <span v-if="isConnecting" class="vpn-app__status-text">Подключение...</span>
          <span v-else-if="isVpnEnabled" class="vpn-app__status-text">Защищено</span>
          <span v-else class="vpn-app__status-text">Не защищено</span>
        </div>
      </div>

      <!-- Большая кнопка -->
      <div class="vpn-app__power-wrap">
        <button
          class="vpn-app__power"
          :class="{
            'vpn-app__power--active': isVpnEnabled,
            'vpn-app__power--connecting': isConnecting
          }"
          :disabled="isConnecting"
          @click="toggleVpn"
        >
          <UIcon
            :name="isVpnEnabled ? 'i-lucide-shield-check' : 'i-lucide-shield-off'"
            class="vpn-app__power-icon"
          />
        </button>
        <div class="vpn-app__power-label">
          {{
            isConnecting
              ? 'Подключение...'
              : isVpnEnabled
                ? 'Нажмите для отключения'
                : 'Нажмите для включения'
          }}
        </div>
      </div>

      <!-- Выбор сервера -->
      <div class="vpn-app__servers">
        <div class="vpn-app__servers-title">Сервер</div>
        <div
          v-for="server in servers"
          :key="server.id"
          class="vpn-app__server"
          :class="{ 'vpn-app__server--selected': selectedServer === server.id }"
          @click="selectedServer = server.id"
        >
          <div class="vpn-app__server-info">
            <span class="vpn-app__server-name">{{ server.label }}</span>
            <span class="vpn-app__server-location">{{ server.location }}</span>
          </div>
          <span class="vpn-app__server-ping">{{ server.ping }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vpn-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
  user-select: none;

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
  }

  &__icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #3b82f6;
    border-radius: 8px;
  }

  &__shield {
    color: #fff;
    font-size: 18px;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 20px;
    gap: 20px;
    overflow-y: auto;
  }

  &__status {
    padding: 8px 20px;
    border-radius: 999px;
    background: #fee2e2;
    color: #dc2626;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.3s;

    &--active {
      background: #dcfce7;
      color: #16a34a;
    }
  }

  &__status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #dc2626;
    transition: background 0.3s;

    &--active {
      background: #16a34a;
    }
  }

  &__power-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  &__power {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 3px solid #cbd5e1;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    &--active {
      border-color: #16a34a;
      background: #dcfce7;

      &:hover {
        border-color: #ef4444;
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
      }
    }

    &--connecting {
      border-color: #f59e0b;
      animation: pulse 1s infinite;
    }
  }

  &__power-icon {
    font-size: 36px;
    color: #64748b;
    transition: color 0.3s;

    .vpn-app__power--active & {
      color: #16a34a;
    }

    .vpn-app__power--connecting & {
      color: #f59e0b;
    }
  }

  &__power-label {
    font-size: 12px;
    color: #94a3b8;
    text-align: center;
  }

  &__servers {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }

  &__servers-title {
    padding: 10px 14px 6px;
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__server {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: #f1f5f9;
    }

    &--selected {
      background: #eff6ff;

      .vpn-app__server-name {
        color: #3b82f6;
        font-weight: 500;
      }
    }
  }

  &__server-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  &__server-name {
    font-size: 13px;
    font-weight: 500;
    color: #0f172a;
  }

  &__server-location {
    font-size: 11px;
    color: #94a3b8;
  }

  &__server-ping {
    font-size: 11px;
    color: #64748b;
    font-family: monospace;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
