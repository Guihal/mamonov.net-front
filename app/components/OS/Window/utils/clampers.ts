import type { WindowOb } from '../Window'
import { getTargetBounds, type WindowBoundsKey } from '~/composables/useWindowBounds'

// Минимальный размер окна (ширина/высота)
export const MINSIZE = 320

export type ClampFn = (
  value: number,
  windowOb: WindowOb,
  cw: number, // content width
  ch: number // content height
) => number

/**
 * Функции ограничения (clamp) для свойств окна.
 */
export const clampHandlers: Record<string, ClampFn> = {
  top: (v, windowOb, _cw, ch) => {
    const target = getTargetBounds(windowOb.id)
    return Math.max(0, Math.min(v, ch - Math.min(target.height, MINSIZE)))
  },

  left: (v, windowOb, cw, _ch) => {
    const target = getTargetBounds(windowOb.id)
    return Math.max(0, Math.min(v, cw - Math.min(target.width, MINSIZE)))
  },

  width: (v, _windowOb, cw, _ch) => Math.max(MINSIZE, Math.min(v, cw)),

  height: (v, _windowOb, _cw, ch) => Math.max(MINSIZE, Math.min(v, ch))
}
