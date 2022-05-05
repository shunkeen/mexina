import { Producer, Prosumer, Consumer } from '../machine/machine';
import { Ex, ex } from './ex';
import { toGenerator } from '../producer/toGenerator';
import { fromIterator } from '../producer/fromIterator';

export type ExGenerator<R> = Readonly<{
    get: Generator<R>;
    then: <T>(transformer: (generator: Generator<R>) => T) => T;
    pipe: <S, T>(prosumer: Prosumer<R, S, T>) => ExGenerator<T>;
    end: <S, U>(consumer: Consumer<R, S, U>) => U;
}>;
export function exGenerator<R>(generator: Generator<R>): ExGenerator<R> {
    return {
        get: generator,
        then: (transformer) => transformer(generator),
        end: (consumer) => exFromGenerator(generator).end(consumer),
        pipe: (prosumer) =>
            exFromGenerator(generator).pipe(prosumer).then(toExGenerator),
    };
}

type ExFromGenerator<T> = Ex<Iterator<T>, T>;
export function exFromGenerator<T>(iterator: Iterator<T>): ExFromGenerator<T> {
    return ex(fromIterator(iterator));
}

export function toExGenerator<S, T>(producer: Producer<S, T>): ExGenerator<T> {
    return exGenerator(toGenerator(producer));
}
