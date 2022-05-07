import { Prosumer, exAwait, exBreak, nop } from '../machine/machine';

type Filter<T> = Prosumer<T, undefined, T>;
export function filter<T>(predicate: (value: T) => boolean): Filter<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, action) => {
            if (action.kind === 'continue') return [_, exAwait];
            if (action.kind === 'break') return [_, exBreak];
            return predicate(action.value) ? [_, action] : [_, exAwait];
        },
    };
}
