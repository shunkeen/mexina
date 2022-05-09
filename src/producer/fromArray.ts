import { Producer, machine, exBreak, exYield } from '../machine/machine';

type FromArray<T> = Producer<number, T>;
export const fromArray = <T>(array: ArrayLike<T>): FromArray<T> =>
    machine<FromArray<T>>(0, (index) =>
        0 <= index && index < array.length
            ? [index + 1, exYield(array[index])]
            : [index, exBreak]
    );
