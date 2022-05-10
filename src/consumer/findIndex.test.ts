import {
    findIndex,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    LazyList,
    lazyList,
    lazyTail,
} from '../index';

test('found', () => {
    const x = exArray([1, 2, 3]).end(findIndex((x) => x > 1));
    expect(x).toBe(1);
});

test('not found', () => {
    const x = exArray([1, 2, 3]).end(findIndex((x) => x > 5));
    expect(x).toBe(-1);
});

test('exGenerator', () => {
    function* infinite() {
        while (true) yield* [1, 2, 3];
    }

    const x = exGenerator(infinite()).end(findIndex((x) => x > 1));
    expect(x).toBe(1);
});

test('exIterable', () => {
    const infinite = {
        *[Symbol.iterator]() {
            while (true) yield* [1, 2, 3];
        },
    };

    const x = exIterable(infinite).end(findIndex((x) => x > 1));
    expect(x).toBe(1);
});

test('exLazyList', () => {
    const ll1: LazyList<number> = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll1));

    const x = exLazyList(ll1).end(findIndex((x) => x > 1));
    expect(x).toBe(1);
});
