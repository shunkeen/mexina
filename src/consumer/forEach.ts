import { Consumer, exAwait, exReturn, nop } from '../machine/machine';

type ForEach<T> = Consumer<T, void, void>;
export function forEach<T>(body: (value: T) => void): ForEach<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            return event.kind === 'break'
                ? [_, exReturn(_)]
                : [void body(event.value), exAwait];
        },
    };
}
