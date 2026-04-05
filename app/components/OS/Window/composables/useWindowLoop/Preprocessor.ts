import {
    getTargetBounds,
    getCalculatedBounds,
    type WindowBoundsKey,
} from '~/composables/useWindowBounds';
import type { WindowLoopController } from './useWindowLoop';

/**
 * Пре processor для расчёта интерполяции значений границ.
 */
export class Preprocessor {
    controller: WindowLoopController;

    constructor(controller: WindowLoopController) {
        this.controller = controller;
    }

    private getCoeff(): number {
        if (
            this.controller.windowOb.states.drag ||
            this.controller.windowOb.states.resize
        ) {
            return 0.6;
        }
        return 0.9;
    }

    calculate(key: WindowBoundsKey, deltaTime: number) {
        const target = getTargetBounds(this.controller.windowOb.id);
        const calculated = getCalculatedBounds(this.controller.windowOb.id);

        const delta = target[key] - calculated[key];

        const totalDelta = this.getEaysied(delta, deltaTime);

        calculated[key] += totalDelta;
    }

    getEaysied(delta: number, deltaTime: number) {
        const coeff = this.getCoeff();
        const factor = 1 - Math.pow(coeff, deltaTime / 16);

        return delta * factor;
    }
}
