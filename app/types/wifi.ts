import type { GameControllerContext } from './game'

export interface WifiNetwork {
  /** Уникальный id сети */
  id: string
  /** Отображаемое имя (SSID) */
  ssid: string
  /** Уровень сигнала 0–4 */
  signalLevel: number
  /** Есть ли замок (защита) */
  isSecured: boolean
  /** Является ли сеть поддельной (для логики урока, не показывается пользователю) */
  isFake?: boolean
}

export interface WifiConfig {
  /** Список доступных сетей */
  networks: WifiNetwork[]
  /** ID сети, к которой подключён при старте. Если не задан — не подключён ни к какой */
  connectedId?: string
  /** Текст кнопки VPN (если задан — показывается VPN-переключатель) */
  vpnLabel?: string
  /** Колбэк при подключении к сети */
  onConnect?: (ctrl: GameControllerContext, networkId: string) => void
  /** Колбэк при отключении от сети */
  onDisconnect?: (ctrl: GameControllerContext, networkId: string) => void
  /** Колбэк при включении VPN */
  onVpnToggle?: (ctrl: GameControllerContext, enabled: boolean) => void
}
