import { Producer, Prosumer, Consumer } from '../machine/machine';
import { Ex, ex } from './ex';
import { toIterable } from '../producer/toIterable';
import { fromIterable } from '../producer/fromIterable';

export type ExIterable<R> = Readonly<{
    get: Iterable<R>;
    then: <T>(transformer: (iterable: Iterable<R>) => T) => T;
    pipe: <S, T>(prosumer: Prosumer<R, S, T>) => ExIterable<T>;
    end: <S, U>(consumer: Consumer<R, S, U>) => U;
}>;
export function exIterable<R>(iterable: Iterable<R>): ExIterable<R> {
    return {
        get: iterable,
        then: (transformer) => transformer(iterable),
        end: (consumer) => exFromIterable(iterable).end(consumer),
        pipe: (prosumer) =>
            exFromIterable(iterable).pipe(prosumer).then(toExIterable),
    };
}

type ExFromIterable<T> = Ex<() => Iterator<T>, T>;
export function exFromIterable<T>(iterable: Iterable<T>): ExFromIterable<T> {
    return ex(fromIterable(iterable));
}

export function toExIterable<S, T>(producer: Producer<S, T>): ExIterable<T> {
    return exIterable(toIterable(producer));
}
