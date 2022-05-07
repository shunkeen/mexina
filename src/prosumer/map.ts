import { Prosumer, exAwait, nop, exYield } from '../machine/machine';

type Map<R, T> = Prosumer<R, undefined, T>;
export function map<R, T>(transformer: (value: R) => T): Map<R, T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            return event.kind === 'break'
                ? [_, event]
                : [_, exYield(transformer(event.value))];
        },
    };
}
