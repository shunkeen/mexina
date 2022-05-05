import { Nil } from './list';

export type ReturnLazyList<T> = Nil | LazyTail<T>;

export type LazyList<T> = Readonly<{
    kind: 'lazyList';
    force: () => ReturnLazyList<T>;
}>;
export function lazyList<T>(thunk: () => ReturnLazyList<T>): LazyList<T> {
    let memo: ReturnLazyList<T>;
    function force(): ReturnLazyList<T> {
        if (memo === undefined) {
            memo = thunk();
        }
        return memo;
    }

    return {
        kind: 'lazyList',
        force,
    };
}

export { Nil, nil } from './list';

export type LazyTail<T> = Readonly<{
    kind: 'lazyTail';
    head: T;
    tail: LazyList<T>;
}>;
export function lazyTail<T>(head: T, tail: LazyList<T>): LazyTail<T> {
    return {
        kind: 'lazyTail',
        head,
        tail,
    };
}
