import { Consumer, exAwait, exReturn, nop } from '../machine/machine';

type Some<T> = Consumer<T, undefined, boolean>;
export function some<T>(predicate: (value: T) => boolean): Some<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, action) => {
            if (action.kind === 'continue') return [_, exAwait];
            if (action.kind === 'break') return [_, exReturn(false)];
            return predicate(action.value) ? [_, exReturn(true)] : [_, exAwait];
        },
    };
}
