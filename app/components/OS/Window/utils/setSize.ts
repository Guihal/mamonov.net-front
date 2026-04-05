import type { WindowOb } from '../Window';
import { getTargetBounds } from '~/composables/useWindowBounds';
import { MINSIZE } from './clampers';

/**
 * Устанавливает размер (width/height) с учётом минимального размера.
 */
export function setSize(
    windowOb: WindowOb,
    key: 'width' | 'height',
    value: number,
) {
    const target = getTargetBounds(windowOb.id);
    target[key] = Math.max(MINSIZE, value);
}
