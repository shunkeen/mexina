import { Prosumer, exAwait, exBreak, exYield, nop } from '../machine/machine';

type Guard<R, T extends R> = (value: R) => value is T;
type Sifter<R, T extends R> = Prosumer<R, undefined, T>;
export function sifter<R, T extends R>(guard: Guard<R, T>): Sifter<R, T> {
    return {
        done: nop,
        init: undefined,
        next: (_, action) => {
            if (action.kind === 'continue') return [_, exAwait];
            if (action.kind === 'break') return [_, exBreak];
            const { value } = action;
            return guard(value) ? [_, exYield(value)] : [_, exAwait];
        },
    };
}
