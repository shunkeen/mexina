import { Producer, Prosumer, Consumer } from '../machine/machine';
import { Ex, ex } from './ex';
import { toLazyList } from '../producer/toLazyList';
import { fromLazyList } from '../producer/fromLazyList';
import { LazyList } from '../datatype/lazyList';

export type ExLazyList<R> = Readonly<{
    get: LazyList<R>;
    then: <T>(transformer: (list: LazyList<R>) => T) => T;
    pipe: <S, T>(prosumer: Prosumer<R, S, T>) => ExLazyList<T>;
    end: <S, U>(consumer: Consumer<R, S, U>) => U;
}>;
export function exLazyList<R>(list: LazyList<R>): ExLazyList<R> {
    return {
        get: list,
        then: (transformer) => transformer(list),
        end: (consumer) => exFromLazyList(list).end(consumer),
        pipe: (prosumer) =>
            exFromLazyList(list).pipe(prosumer).then(toExLazyList),
    };
}

type ExFromLazyList<T> = Ex<LazyList<T>, T>;
export function exFromLazyList<T>(list: LazyList<T>): ExFromLazyList<T> {
    return ex(fromLazyList(list));
}

export function toExLazyList<S, T>(producer: Producer<S, T>): ExLazyList<T> {
    return exLazyList(toLazyList(producer));
}
