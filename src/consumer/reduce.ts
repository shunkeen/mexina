import { Consumer, exAwait, exReturn, nop } from '../machine/machine';

type Reduce<R, T> = Consumer<R, T, T>;
type Reducer<R, T> = (result: T, value: R) => T;

export function reduce<R, T>(init: T, reducer: Reducer<R, T>): Reduce<R, T> {
    return {
        done: nop,
        init,
        next: (result, event) => {
            if (event.kind === 'continue') return [result, exAwait];
            return event.kind === 'break'
                ? [result, exReturn(result)]
                : [reducer(result, event.value), exAwait];
        },
    };
}
