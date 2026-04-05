import { OFFSET } from '~/utils/constants/OFFSET';
import type { WindowOb } from '../Window';
import { getTargetBounds } from '~/composables/useWindowBounds';

/**
 * Composable для перетаскивания окна за заголовок.
 */
export function useMove(windowOb: WindowOb) {
    const lastX = ref(0);
    const lastY = ref(0);

    const { contentArea } = useContentArea();
    const { focus } = useFocusWindowController();
    const target = getTargetBounds(windowOb.id);

    const isOutOfBounds = () => {
        return (
            lastX.value < OFFSET ||
            lastY.value < OFFSET ||
            lastX.value > contentArea.value.width - OFFSET * 2 ||
            lastY.value > contentArea.value.height - OFFSET * 2
        );
    };

    const callback = () => {
        if (isOutOfBounds()) {
            windowOb.states['fullscreen-ready'] = true;
        } else {
            delete windowOb.states['fullscreen-ready'];
        }
    };

    watch(lastX, callback, {
        immediate: true,
    });

    watch(lastY, callback, {
        immediate: true,
    });

    return (ev: PointerEvent) => {
        if (windowOb.states.fullscreen) return;
        focus(windowOb.id);
        windowOb.states.drag = true;

        lastY.value = ev.clientY;
        lastX.value = ev.clientX;

        const pointerMove = (ev: PointerEvent) => {
            const deltaY = ev.clientY - lastY.value;
            const deltaX = ev.clientX - lastX.value;

            lastY.value = ev.clientY;
            lastX.value = ev.clientX;

            target.top += deltaY;
            target.left += deltaX;
        };

        const pointerup = (ev: PointerEvent) => {
            lastY.value = ev.clientY;
            lastX.value = ev.clientX;

            delete windowOb.states.drag;

            document.removeEventListener('pointermove', pointerMove);
            document.removeEventListener('pointerup', pointerup);

            if (windowOb.states['fullscreen-ready']) {
                windowOb.states.fullscreen = true;
            }

            delete windowOb.states['fullscreen-ready'];
        };

        document.addEventListener('pointermove', pointerMove);
        document.addEventListener('pointerup', pointerup);
    };
}
