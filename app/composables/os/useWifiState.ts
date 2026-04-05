import type { WifiConfig, WifiNetwork } from '~/types/wifi'

const WIFI_STATE_KEY = 'os_wifi_state'

/**
 * Глобальное состояние Wi-Fi, доступное всем компонентам OS.
 * Инициализируется через provide('wifiConfig', ...) из gameController.
 * Если wifiConfig не задан — Wi-Fi-трей не показывается.
 */
export function useWifiState() {
  const networks = useState<WifiNetwork[]>(`${WIFI_STATE_KEY}_networks`, () => [])
  const connectedId = useState<string | null>(`${WIFI_STATE_KEY}_connected`, () => null)
  const vpnEnabled = useState<boolean>(`${WIFI_STATE_KEY}_vpn`, () => false)
  const isOpen = useState<boolean>(`${WIFI_STATE_KEY}_open`, () => false)

  const connectedNetwork = computed(() =>
    connectedId.value ? (networks.value.find((n) => n.id === connectedId.value) ?? null) : null
  )

  const isConnected = computed(() => connectedId.value !== null)

  function init(config: WifiConfig) {
    networks.value = config.networks
    connectedId.value = config.connectedId ?? null
    vpnEnabled.value = false
    isOpen.value = false
  }

  function connect(id: string) {
    connectedId.value = id
  }

  function disconnect() {
    connectedId.value = null
  }

  function toggleVpn(value?: boolean) {
    vpnEnabled.value = value ?? !vpnEnabled.value
  }

  function reset() {
    networks.value = []
    connectedId.value = null
    vpnEnabled.value = false
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function close() {
    isOpen.value = false
  }

  return {
    networks: readonly(networks),
    connectedId: readonly(connectedId),
    connectedNetwork,
    isConnected,
    vpnEnabled: readonly(vpnEnabled),
    isOpen,
    init,
    connect,
    disconnect,
    toggleVpn,
    reset,
    toggle,
    close
  }
}
