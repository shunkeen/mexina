import { Producer, exBreak, exYield, nop } from '../machine/machine';

type FromArray<T> = Producer<number, T>;
export function fromArray<T>(array: ArrayLike<T>): FromArray<T> {
    return {
        done: nop,
        init: 0,
        next: (index) =>
            0 <= index && index < array.length
                ? [index + 1, exYield(array[index])]
                : [index, exBreak],
    };
}
