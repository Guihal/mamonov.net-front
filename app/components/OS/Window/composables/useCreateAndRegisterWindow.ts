import type { FsFile } from '~~/shared/types/FsFile';
import { useGetId } from '../utils/useGetId';
import type { WindowStates, WindowOb } from '../Window';
import { useAllWindows } from '~/composables/useAllWindows';
import { useWindowPaths } from '~/composables/useWindowPaths';
import { useFocusWindowController } from '~/composables/useFocusController';

interface UseCreateAndRegisterWindowOptions {
    isForce?: boolean;
}

/**
 * Создаёт новое окно и регистрирует его в allWindows.
 */
export function useCreateAndRegisterWindow(
    file: FsFile | string,
    options: UseCreateAndRegisterWindowOptions = {
        isForce: false,
    },
): WindowOb | null {
    const { allWindows } = useAllWindows();
    const { hasPath } = useWindowPaths();
    const { focus } = useFocusWindowController();

    const path = typeof file === 'string' ? file : file.path;

    if (!options.isForce) {
        const idWindow = hasPath(path);
        if (idWindow !== false) {
            focus(idWindow);
            return null;
        }
    }

    const id = useGetId();

    const states: WindowStates = {};

    const realFile = typeof file === 'string' ? null : file;

    const windowOb: WindowOb = {
        id,
        states,
        targetFile: {
            value: path,
        },
        file: realFile,
    };

    allWindows.value[id] = windowOb;

    return windowOb;
}
