import type { WindowOb } from '../Window';
import { removeWindowBounds } from '~/composables/useWindowBounds';

/**
 * Удаляет окно из глобального хранилища allWindows.
 */
export function useRemoveWindow(windowOb: WindowOb) {
    const { allWindows } = useAllWindows();

    removeWindowBounds(windowOb.id);

    delete allWindows.value[windowOb.id];
}
