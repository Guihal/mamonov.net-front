import { useContentArea } from '~/composables/useContentArea'
import { clampHandlers, type ClampFn } from '../utils/clampers'
import type { WindowOb } from '../Window'
import { getTargetBounds } from '~/composables/useWindowBounds'

export const chainedProperties = {
  top: {
    primary: 'top',
    compensate: 'height'
  },
  left: {
    primary: 'left',
    compensate: 'width'
  },
  bottom: {
    primary: 'height',
    compensate: null
  },
  right: {
    primary: 'width',
    compensate: null
  }
} as const

export type ChainedProperties = typeof chainedProperties
export type ChainedKey = keyof ChainedProperties
export type ControlledResult<K extends ChainedKey> = {
  [P in K]: (x: number, y: number) => void
}

const calculate = {
  top: (windowOb: WindowOb, x: number, y: number) => {
    return y - getTargetBounds(windowOb.id).top
  },

  left: (windowOb: WindowOb, x: number, _y: number) => {
    return x - getTargetBounds(windowOb.id).left
  },

  bottom: (windowOb: WindowOb, _x: number, y: number) => {
    const target = getTargetBounds(windowOb.id)
    return y - (target.top + target.height)
  },

  right: (windowOb: WindowOb, x: number, _y: number) => {
    const target = getTargetBounds(windowOb.id)
    return x - (target.left + target.width)
  }
}

/**
 * Создаёт функции для изменения размера по указанным направлениям.
 */
export function useResizeForDirections<K extends ChainedKey>(
  windowOb: WindowOb,
  properties: K[]
): ControlledResult<K> {
  const { contentArea } = useContentArea()
  const result = {} as ControlledResult<K>
  const target = getTargetBounds(windowOb.id)

  for (const key of properties) {
    const { primary, compensate } = chainedProperties[key]

    ;(result as Record<string, (x: number, y: number) => void>)[key] = (x: number, y: number) => {
      const delta = calculate[key](windowOb, x, y)

      const clampPrimary = clampHandlers[primary] as ClampFn

      const clampedPrimary = clampPrimary(
        target[primary] + delta,
        windowOb,
        contentArea.value.width,
        contentArea.value.height
      )

      const clampedPrimaryDelta = clampedPrimary - target[primary]

      if (compensate) {
        const clampCompensate = clampHandlers[compensate] as ClampFn

        const clampedCompensate = clampCompensate(
          target[compensate] - delta,
          windowOb,
          contentArea.value.width,
          contentArea.value.height
        )

        const clampedCompensateDelta = clampedCompensate - target[compensate]

        if (clampedCompensateDelta === 0 || clampedPrimaryDelta === 0) return

        target[compensate] = clampedCompensate
      }

      target[primary] = clampedPrimary
    }
  }

  return result
}
