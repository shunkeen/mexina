import {
    Consumer,
    ConsumerEvent,
    machine,
    ExAwait,
    exAwait,
    exReturn,
    ExContinue,
    exContinue,
} from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';
import { List, nil, cons } from '../datatype/list';

type ReduceR<R, T> = Consumer<R, ReduceRState<R, T>, T>;
type ReduceR1<R> = Consumer<R, ReduceRState<R>, ExCatch<R, TypeError>>;
type ReduceRState<R, T = undefined> = readonly [boolean, List<R>, T];
type ReduceRFunction = {
    <R, T>(reducer: (result: T, value: R) => T, init: T): ReduceR<R, T>;
    <R>(reducer: (result: R, value: R) => R): ReduceR1<R>;
};

export const reduceRight: ReduceRFunction = <R, T>(
    ...args:
        | readonly [(result: T, value: R) => T, T]
        | readonly [(result: R, value: R) => R]
): ReduceR<R, T> | ReduceR1<R> =>
    args.length === 2 ? reduceR(...args) : reduceR1(...args);

export const reduceR = <R, T>(
    reducer: (result: T, value: R) => T,
    init: T
): ReduceR<R, T> =>
    machine<ReduceR<R, T>>(
        [false, nil, init],
        ([isBroken, list, result], event) => {
            if (!isBroken) return accumulate(list, result, event);
            if (list.kind === 'nil')
                return [[isBroken, list, result], exReturn(result)];

            const { tail, head } = list;
            return [[isBroken, tail, reducer(result, head)], exContinue];
        }
    );

export const reduceR1 = <R>(reducer: (result: R, value: R) => R): ReduceR1<R> =>
    machine<ReduceR1<R>>(
        [false, nil, undefined],
        ([isBroken, list, _], event) => {
            if (!isBroken) return accumulate(list, _, event);
            if (list.kind === 'nil') {
                const message = 'Reduce of empty with no initial value';
                const error = new TypeError(message);
                return [[isBroken, list, _], exReturn(exThrow(error))];
            }

            const { tail, head } = list;
            if (tail.kind === 'nil')
                return [[isBroken, tail, _], exReturn(exReturn(head))];

            const list2 = cons(reducer(head, tail.head), tail.tail);
            return [[isBroken, list2, _], exContinue];
        }
    );

const accumulate = <R, T>(
    list: List<R>,
    result: T,
    event: ConsumerEvent<R>
): readonly [ReduceRState<R, T>, ExAwait | ExContinue] => {
    if (event.kind === 'break') return [[true, list, result], exContinue];
    return event.kind === 'continue'
        ? [[false, list, result], exAwait]
        : [[false, cons(event.value, list), result], exAwait];
};
