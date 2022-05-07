import {
    Consumer,
    exAwait,
    exContinue,
    exReturn,
    nop,
} from '../machine/machine';

type Every<T> = Consumer<T, undefined, boolean>;
export function every<T>(predicate: (value: T) => boolean): Every<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, action) => {
            if (action.kind === 'continue') return [_, exAwait];
            if (action.kind === 'break') return [_, exReturn(true)];
            return predicate(action.value)
                ? [_, exContinue]
                : [_, exReturn(false)];
        },
    };
}
