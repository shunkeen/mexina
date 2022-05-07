import { Consumer, exAwait, exReturn, nop } from '../machine/machine';

type Every<T> = Consumer<T, undefined, boolean>;
export function every<T>(predicate: (value: T) => boolean): Every<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            if (event.kind === 'break') return [_, exReturn(true)];
            return predicate(event.value) ? [_, exAwait] : [_, exReturn(false)];
        },
    };
}
