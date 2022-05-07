import { Prosumer, exAwait, exYield, nop } from '../machine/machine';

type Guard<R, T extends R> = (value: R) => value is T;
type Sifter<R, T extends R> = Prosumer<R, undefined, T>;

export function sifter<R, T extends R>(guard: Guard<R, T>): Sifter<R, T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            if (event.kind === 'break') return [_, event];
            const { value } = event;
            return guard(value) ? [_, exYield(value)] : [_, exAwait];
        },
    };
}
