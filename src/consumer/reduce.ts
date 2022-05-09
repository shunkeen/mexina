import { Consumer, machine, exAwait, exReturn } from '../machine/machine';

type Reduce<R, T> = Consumer<R, T, T>;
export const reduce = <R, T>(
    init: T,
    reducer: (result: T, value: R) => T
): Reduce<R, T> =>
    machine<Reduce<R, T>>(init, (result, event) => {
        if (event.kind === 'continue') return [result, exAwait];
        return event.kind === 'break'
            ? [result, exReturn(result)]
            : [reducer(result, event.value), exAwait];
    });
