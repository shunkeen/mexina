import { Prosumer, machine, exAwait, exYield } from '../machine/machine';

type Entries<T> = Prosumer<T, number, readonly [number, T]>;
export const entries = <T>(): Entries<T> =>
    machine<Entries<T>>(0, (count, event) => {
        if (event.kind === 'continue') return [count, exAwait];
        return event.kind === 'break'
            ? [count, event]
            : [count + 1, exYield([count, event.value])];
    });
