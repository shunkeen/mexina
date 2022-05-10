import { Consumer } from '../machine/machine';
import { rethrow } from './rethrow';
import { reduceL, reduceL1 } from './exReduce';
import { ExCatch } from '../datatype/exCatch';

type Reduce<R, T> = Consumer<R, T, T>;
type Reduce1<R> = Consumer<R, ExCatch<R, TypeError>, R>;
type ReduceFunction = {
    <R, T>(reducer: (result: T, value: R) => T, init: T): Reduce<R, T>;
    <R>(reducer: (result: R, value: R) => R): Reduce1<R>;
};

export const reduce: ReduceFunction = <R, T>(
    ...args:
        | readonly [(result: T, value: R) => T, T]
        | readonly [(result: R, value: R) => R]
): Reduce<R, T> | Reduce1<R> =>
    args.length === 2 ? reduceL(...args) : rethrow(reduceL1(...args));
