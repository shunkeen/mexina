import { Producer, machine, exBreak, exYield } from '../machine/machine';
import { LazyList } from '../datatype/lazyList';

type FromLazyList<T> = Producer<LazyList<T>, T>;
export const fromLazyList = <T>(lazylist: LazyList<T>): FromLazyList<T> =>
    machine<FromLazyList<T>>(lazylist, (lazylist) => {
        const list = lazylist.force();
        return list.kind === 'nil'
            ? [lazylist, exBreak]
            : [list.tail, exYield(list.head)];
    });
