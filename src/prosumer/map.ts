import { Prosumer, exAwait, nop, exYield } from '../machine/machine';

type Map<R, T> = Prosumer<R, undefined, T>;
export function map<R, T>(transformer: (value: R) => T): Map<R, T> {
    return {
        done: nop,
        init: undefined,
        next: (_, action) => {
            if (action.kind === 'continue') return [_, exAwait];
            return action.kind === 'break'
                ? [_, action]
                : [_, exYield(transformer(action.value))];
        },
    };
}
