import { Prosumer, exAwait, exBreak, exYield, nop } from '../machine/machine';

type Full<T> = Prosumer<unknown, number, T>;
export function full<T>(value: T): Full<T> {
    return {
        done: nop,
        init: 0,
        next: (count, event) => {
            if (event.kind === 'continue') return [count, exAwait];
            return event.kind === 'break'
                ? [count, exBreak]
                : [count + 1, exYield(value)];
        },
    };
}
