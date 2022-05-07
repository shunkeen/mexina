import { Prosumer, exAwait, nop } from '../machine/machine';

type Filter<T> = Prosumer<T, undefined, T>;
export function filter<T>(predicate: (value: T) => boolean): Filter<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            if (event.kind === 'break') return [_, event];
            return predicate(event.value) ? [_, event] : [_, exAwait];
        },
    };
}
