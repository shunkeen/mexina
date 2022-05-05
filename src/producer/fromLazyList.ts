import { Producer, exBreak, exYield, nop } from '../machine/machine';
import { LazyList } from '../datatype/lazyList';

type FromLazyList<T> = Producer<LazyList<T>, T>;
export function fromLazyList<T>(lazylist: LazyList<T>): FromLazyList<T> {
    return {
        done: nop,
        init: lazylist,
        next: (ll) => {
            const list = ll.force();
            return list.kind === 'nil'
                ? [ll, exBreak]
                : [list.tail, exYield(list.head)];
        },
    };
}
