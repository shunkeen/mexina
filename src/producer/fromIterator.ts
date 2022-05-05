import { Producer, exBreak, exYield, nop } from '../machine/machine';

type FromIterator<T> = Producer<Iterator<T>, T>;
export function fromIterator<T>(iterator: Iterator<T>): FromIterator<T> {
    return {
        done: nop,
        init: iterator,
        next: (iterator) => {
            const result = iterator.next();
            return !result.done
                ? [iterator, exYield(result.value)]
                : [iterator, exBreak];
        },
    };
}
