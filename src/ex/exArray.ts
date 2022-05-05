import { Producer, Prosumer, Consumer } from '../machine/machine';
import { Ex, ex } from './ex';
import { toArray } from '../consumer/toArray';
import { fromArray } from '../producer/fromArray';
import { toHermit } from '../machine/toHermit';
import { runHermit } from '../machine/runHermit';

export type ExArray<R> = Readonly<{
    get: ReadonlyArray<R>;
    then: <T>(transformer: (array: ReadonlyArray<R>) => T) => T;
    pipe: <S, T>(prosumer: Prosumer<R, S, T>) => ExArray<T>;
    end: <S, U>(consumer: Consumer<R, S, U>) => U;
}>;
export function exArray<R>(array: ReadonlyArray<R>): ExArray<R> {
    return {
        get: array,
        then: (transformer) => transformer(array),
        end: (consumer) => exFromArray(array).end(consumer),
        pipe: (prosumer) => exFromArray(array).pipe(prosumer).then(toExArray),
    };
}

type ExFromArray<T> = Ex<number, T>;
export function exFromArray<T>(array: ArrayLike<T>): ExFromArray<T> {
    return ex(fromArray(array));
}

export function toExArray<S, T>(producer: Producer<S, T>): ExArray<T> {
    return exArray(runHermit(toHermit(producer, toArray())));
}
