import { Consumer, exAwait, exReturn, nop } from '../machine/machine';

type Some<T> = Consumer<T, undefined, boolean>;
export function some<T>(predicate: (value: T) => boolean): Some<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            if (event.kind === 'break') return [_, exReturn(false)];
            return predicate(event.value) ? [_, exReturn(true)] : [_, exAwait];
        },
    };
}
