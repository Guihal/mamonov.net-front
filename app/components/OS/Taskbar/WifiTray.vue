<script setup lang="ts">
import type { WifiConfig } from '~/types/wifi'
import { GAME_CONTROLLER_KEY } from '~/types/game'
import { useWifiState } from '~/composables/os/useWifiState'

const wifiConfig = inject<WifiConfig | null>('wifiConfig', null)
const ctrl = inject(GAME_CONTROLLER_KEY, null)

const {
  networks,
  connectedId,
  connectedNetwork,
  isConnected,
  vpnEnabled,
  isOpen,
  connect,
  disconnect,
  toggleVpn,
  close
} = useWifiState()

function getSignalBars(level: number): boolean[] {
  return [1, 2, 3, 4].map((i) => i <= level)
}

function handleConnect(networkId: string) {
  if (connectedId.value === networkId) return
  connect(networkId)
  close()
  if (wifiConfig && ctrl) {
    wifiConfig.onConnect?.(ctrl, networkId)
  }
}

function handleDisconnect() {
  const prevId = connectedId.value
  disconnect()
  close()
  if (wifiConfig && ctrl && prevId) {
    wifiConfig.onDisconnect?.(ctrl, prevId)
  }
}

function handleVpnToggle() {
  const newVal = !vpnEnabled.value
  toggleVpn(newVal)
  if (wifiConfig && ctrl) {
    wifiConfig.onVpnToggle?.(ctrl, newVal)
  }
}

function togglePanel() {
  isOpen.value = !isOpen.value
}

/** Закрытие при клике за пределами */
function onOverlayClick() {
  close()
}
</script>

<template>
  <div v-if="networks.length" class="wifi-tray">
    <button
      class="wifi-tray__btn taskbar__el"
      :class="{ 'wifi-tray__btn--active': isOpen }"
      :title="connectedNetwork ? `Wi-Fi: ${connectedNetwork.ssid}` : 'Wi-Fi: не подключено'"
      @click.stop="togglePanel"
    >
      <!-- Wi-Fi icon -->
      <svg
        v-if="isConnected"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.4"
      >
        <line x1="2" y1="2" x2="22" y2="22" />
        <path d="M8.5 16.5a5 5 0 0 1 7 0" />
        <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
        <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
        <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
        <path d="M5 12.55a10 10 0 0 1 5.17-2.39" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    </button>

    <!-- Popup -->
    <Transition name="wifi-popup">
      <div v-if="isOpen" class="wifi-tray__popup" @click.stop>
        <div class="wifi-tray__header">
          <span class="wifi-tray__title">Wi-Fi</span>
          <span v-if="connectedNetwork" class="wifi-tray__connected-label">
            {{ connectedNetwork.ssid }}
          </span>
        </div>

        <!-- VPN toggle -->
        <div v-if="wifiConfig?.vpnLabel" class="wifi-tray__vpn">
          <span class="wifi-tray__vpn-label">
            <UIcon name="i-lucide-shield" />
            {{ wifiConfig.vpnLabel }}
          </span>
          <button
            class="wifi-tray__vpn-toggle"
            :class="{ 'wifi-tray__vpn-toggle--on': vpnEnabled }"
            @click="handleVpnToggle"
          >
            <span class="wifi-tray__vpn-knob" />
          </button>
        </div>

        <!-- Disconnect button -->
        <button v-if="isConnected" class="wifi-tray__disconnect" @click="handleDisconnect">
          <UIcon name="i-lucide-wifi-off" />
          Отключиться
        </button>

        <div class="wifi-tray__divider" />

        <!-- Network list -->
        <div class="wifi-tray__list">
          <button
            v-for="network in networks"
            :key="network.id"
            class="wifi-tray__network"
            :class="{
              'wifi-tray__network--connected': connectedId === network.id,
              'wifi-tray__network--secured': network.isSecured
            }"
            @click="handleConnect(network.id)"
          >
            <div class="wifi-tray__signal">
              <div
                v-for="(active, idx) in getSignalBars(network.signalLevel)"
                :key="idx"
                class="wifi-tray__bar"
                :class="{
                  'wifi-tray__bar--active': active,
                  'wifi-tray__bar--inactive': !active
                }"
              />
            </div>
            <div class="wifi-tray__network-info">
              <span class="wifi-tray__ssid">{{ network.ssid }}</span>
              <span v-if="connectedId === network.id" class="wifi-tray__status">Подключено</span>
            </div>
            <UIcon v-if="network.isSecured" name="i-lucide-lock" class="wifi-tray__lock" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Оверлей для закрытия -->
    <Teleport to="body">
      <div v-if="isOpen" class="wifi-tray__overlay" @click="onOverlayClick" />
    </Teleport>
  </div>
</template>

<style lang="scss">
.wifi-tray {
  position: relative;
  display: flex;
  align-items: center;

  &__btn {
    &--active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  &__popup {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    width: 280px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    padding: 8px;
    z-index: 300;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px 4px;
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
    color: #1f2937;
  }

  &__connected-label {
    font-size: 11px;
    color: #6b7280;
  }

  &__vpn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    margin: 4px 0;
    background: #f8fafc;
    border-radius: 8px;
  }

  &__vpn-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #334155;
  }

  &__vpn-toggle {
    position: relative;
    width: 36px;
    height: 20px;
    border-radius: 10px;
    border: none;
    background: #d1d5db;
    cursor: pointer;
    transition: background 0.2s;

    &--on {
      background: #22c55e;
    }
  }

  &__vpn-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;

    .wifi-tray__vpn-toggle--on & {
      transform: translateX(16px);
    }
  }

  &__disconnect {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 6px 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    color: #dc2626;
    border-radius: 6px;
    transition: background 0.15s;

    &:hover {
      background: #fef2f2;
    }
  }

  &__divider {
    height: 1px;
    background: #e5e7eb;
    margin: 4px 0;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    max-height: 240px;
    overflow-y: auto;
  }

  &__network {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 10px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.15s;

    &:hover {
      background: #f3f4f6;
    }

    &--connected {
      background: #eff6ff;

      &:hover {
        background: #dbeafe;
      }
    }
  }

  &__signal {
    display: flex;
    align-items: flex-end;
    gap: 1.5px;
    height: 14px;
  }

  &__bar {
    width: 3px;
    border-radius: 1px;

    &:nth-child(1) {
      height: 4px;
    }
    &:nth-child(2) {
      height: 7px;
    }
    &:nth-child(3) {
      height: 10px;
    }
    &:nth-child(4) {
      height: 14px;
    }

    &--active {
      background: #1f2937;
    }

    &--inactive {
      background: #d1d5db;
    }

    .wifi-tray__network--connected &--active {
      background: #2563eb;
    }
  }

  &__network-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
  }

  &__ssid {
    font-size: 13px;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  &__status {
    font-size: 10px;
    color: #2563eb;
  }

  &__lock {
    color: #6b7280;
    font-size: 14px;
    flex-shrink: 0;
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 199;
  }
}

.wifi-popup-enter-active,
.wifi-popup-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.wifi-popup-enter-from,
.wifi-popup-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
