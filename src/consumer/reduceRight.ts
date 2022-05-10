import { Consumer } from '../machine/machine';
import { rethrow } from './rethrow';
import { reduceR, reduceR1 } from './exReduceRight';
import { List } from '../datatype/list';

type ReduceR<R, T> = Consumer<R, readonly [boolean, List<R>, T], T>;
type ReduceR1<R> = Consumer<R, readonly [boolean, List<R>, undefined], R>;
type ReduceRFunction = {
    <R, T>(reducer: (result: T, value: R) => T, init: T): ReduceR<R, T>;
    <R>(reducer: (result: R, value: R) => R): ReduceR1<R>;
};

export const reduceRight: ReduceRFunction = <R, T>(
    ...args:
        | readonly [(result: T, value: R) => T, T]
        | readonly [(result: R, value: R) => R]
): ReduceR<R, T> | ReduceR1<R> =>
    args.length === 2 ? reduceR(...args) : rethrow(reduceR1(...args));
