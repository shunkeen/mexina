import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';

type Reduce<R, T> = Consumer<R, T, T>;
type Reduce1<R> = Consumer<R, ExCatch<R, TypeError>, ExCatch<R, TypeError>>;
type ReduceFunction = {
    <R, T>(reducer: (result: T, value: R) => T, init: T): Reduce<R, T>;
    <R>(reducer: (result: R, value: R) => R): Reduce1<R>;
};

export const exReduce: ReduceFunction = <R, T>(
    ...args:
        | readonly [(result: T, value: R) => T, T]
        | readonly [(result: R, value: R) => R]
): Reduce<R, T> | Reduce1<R> =>
    args.length === 2 ? reduceL(...args) : reduceL1(...args);

export const reduceL = <R, T>(
    reducer: (result: T, value: R) => T,
    init: T
): Reduce<R, T> =>
    machine<Reduce<R, T>>(init, (result, event) => {
        if (event.kind === 'continue') return [result, exAwait];
        return event.kind === 'break'
            ? [result, exReturn(result)]
            : [reducer(result, event.value), exAwait];
    });

export const reduceL1 = <R>(reducer: (result: R, value: R) => R): Reduce1<R> =>
    machine<Reduce1<R>>(exThrow(new TypeError('temp')), (temp, event) => {
        if (event.kind === 'continue') return [temp, exAwait];
        if (temp.kind === 'return') {
            return event.kind === 'break'
                ? [temp, exReturn(temp)]
                : [exReturn(reducer(temp.value, event.value)), exAwait];
        }

        if (event.kind === 'yield') {
            const first = exReturn(event.value);
            return [first, exAwait];
        }

        const message = 'Reduce of empty with no initial value';
        const result = exThrow(new TypeError(message));
        return [result, exReturn(result)];
    });
