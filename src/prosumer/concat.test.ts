import {
    concat,
    ex,
    toArray,
    fromArray,
    fromIterator,
    fromIterable,
    fromLazyList,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('double', () => {
    const pd = fromArray([1, 2]);
    const array = ex(pd).pipe(concat(pd)).end(toArray());
    expect(array).toStrictEqual([1, 2, 1, 2]);
});

test('left empty', () => {
    const empty = fromArray<number>([]);
    const pd = fromArray([1, 2]);
    const array = ex(empty).pipe(concat(pd)).end(toArray());
    expect(array).toStrictEqual([1, 2]);
});

test('right empty', () => {
    const pd = fromArray([1, 2]);
    const empty = fromArray<number>([]);
    const array = ex(pd).pipe(concat(empty)).end(toArray());
    expect(array).toStrictEqual([1, 2]);
});

test('double empty', () => {
    const empty = fromArray<number>([]);
    const array = ex(empty).pipe(concat(empty)).end(toArray());
    expect(array.length).toBe(0);
});

test('fromIterator', () => {
    function* generator() {
        yield* [1, 2];
    }

    const pd1 = fromIterator(generator());
    const pd2 = fromIterator(generator());
    const array = ex(pd1).pipe(concat(pd2)).end(toArray());
    expect(array).toStrictEqual([1, 2, 1, 2]);
});

test('fromIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2];
        },
    };

    const pd = fromIterable(iterable);
    const array = ex(pd).pipe(concat(pd)).end(toArray());
    expect(array).toStrictEqual([1, 2, 1, 2]);
});

test('fromLazyList', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, llNil));
    const llNil = lazyList<number>(() => nil);

    const pd = fromLazyList(ll1);
    const array = ex(pd).pipe(concat(pd)).end(toArray());
    expect(array).toStrictEqual([1, 2, 1, 2]);
});
