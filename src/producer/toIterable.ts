import { Producer } from '../machine/machine';
import { toGenerator } from './toGenerator';

export function toIterable<S, T>(producer: Producer<S, T>): Iterable<T> {
    return {
        [Symbol.iterator]: () => toGenerator(producer),
    };
}
