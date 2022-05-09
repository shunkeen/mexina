import { Producer, machine, exBreak, exYield } from '../machine/machine';

type FromIterator<T> = Producer<Iterator<T>, T>;
export const fromIterator = <T>(iterator: Iterator<T>): FromIterator<T> =>
    machine<FromIterator<T>>(iterator, (iterator) => {
        const result = iterator.next();
        return !result.done
            ? [iterator, exYield(result.value)]
            : [iterator, exBreak];
    });
