import { useFocusWindowController } from '~/composables/useFocusController'
import type { WindowOb } from '../Window'

/**
 * Хелпер для фокуса окна по клику.
 */
export const useFocusOnClick = (windowOb: WindowOb) => {
  const { focus } = useFocusWindowController()

  const focusWindow = () => {
    focus(windowOb.id)
  }

  return { focusWindow }
}
