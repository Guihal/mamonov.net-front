import type { GameOverPayload } from '~/types/game'

const _isVisible = () => useState<boolean>('gameOver_isVisible', () => false)
const _payload = () => useState<GameOverPayload | null>('gameOver_payload', () => null)

export function useGameOver() {
  const isVisible = _isVisible()
  const payload = _payload()

  function triggerGameOver(p: GameOverPayload) {
    payload.value = p
    isVisible.value = true
  }

  function resetGameOver() {
    isVisible.value = false
    setTimeout(() => {
      payload.value = null
    }, 300)
  }

  return {
    isVisible: readonly(isVisible),
    payload: readonly(payload),
    triggerGameOver,
    resetGameOver
  }
}
