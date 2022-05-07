import { Prosumer, exAwait, exYield, nop } from '../machine/machine';

type Full<T> = Prosumer<unknown, undefined, T>;
export function full<T>(value: T): Full<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            return event.kind === 'break' ? [_, event] : [_, exYield(value)];
        },
    };
}
