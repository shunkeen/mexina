import {
    toArray,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('empty', () => {
    const array = exArray<number>([]).end(toArray());
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = exArray([1, 2, 3, 4]).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4]);
});

test('exGenerator', () => {
    function* generator() {
        yield* [1, 2, 3, 4];
    }

    const array = exGenerator(generator()).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4]);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2, 3, 4];
        },
    };

    const array = exIterable(iterable).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4]);
});

test('exLazyList', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll4));
    const ll4 = lazyList(() => lazyTail(4, llNil));
    const llNil = lazyList<number>(() => nil);

    const array = exLazyList(ll1).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4]);
});
