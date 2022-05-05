import {
    Consumer,
    exAwait,
    exContinue,
    exReturn,
    nop,
} from '../machine/machine';

type ForEach<T> = Consumer<T, void, void>;
export function forEach<T>(body: (value: T) => void): ForEach<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, action) => {
            if (action.kind === 'continue') return [_, exAwait];
            return action.kind === 'break'
                ? [_, exReturn(_)]
                : [void body(action.value), exContinue];
        },
    };
}
