import { Producer } from '../machine/machine';
import { toGenerator } from './toGenerator';

export const toIterable = <S, T>(producer: Producer<S, T>): Iterable<T> => ({
    [Symbol.iterator]: () => toGenerator(producer),
});
