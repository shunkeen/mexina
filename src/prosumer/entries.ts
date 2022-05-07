import { Prosumer, exAwait, exBreak, exYield, nop } from '../machine/machine';

type Entries<T> = Prosumer<T, number, readonly [number, T]>;
export function entries<T>(): Entries<T> {
    return {
        done: nop,
        init: 0,
        next: (count, event) => {
            if (event.kind === 'continue') return [count, exAwait];
            return event.kind === 'break'
                ? [count, exBreak]
                : [count + 1, exYield([count, event.value])];
        },
    };
}
