import { Producer, machine, exBreak, exYield } from '../machine/machine';

type FromIterable<T> = Producer<() => Iterator<T>, T>;
export const fromIterable = <T>(iterable: Iterable<T>): FromIterable<T> =>
    machine<FromIterable<T>>(
        () => iterable[Symbol.iterator](),
        (thunk) => {
            const iterator = thunk();
            const result = iterator.next();
            return !result.done
                ? [() => iterator, exYield(result.value)]
                : [() => iterator, exBreak];
        }
    );
