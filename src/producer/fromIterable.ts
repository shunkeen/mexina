import { Producer, exBreak, exYield, nop } from '../machine/machine';

type FromIterable<T> = Producer<() => Iterator<T>, T>;
export function fromIterable<T>(iterable: Iterable<T>): FromIterable<T> {
    return {
        done: nop,
        init: () => iterable[Symbol.iterator](),
        next: (thunk) => {
            const iterator = thunk();
            const result = iterator.next();
            return !result.done
                ? [() => iterator, exYield(result.value)]
                : [() => iterator, exBreak];
        },
    };
}
