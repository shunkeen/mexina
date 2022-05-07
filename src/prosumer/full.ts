import { Prosumer, exAwait, exBreak, exYield, nop } from '../machine/machine';

type Full<T> = Prosumer<unknown, number, T>;
export function full<T>(value: T): Full<T> {
    return {
        done: nop,
        init: 0,
        next: (count, action) => {
            if (action.kind === 'continue') return [count, exAwait];
            return action.kind === 'break'
                ? [count, exBreak]
                : [count + 1, exYield(value)];
        },
    };
}
