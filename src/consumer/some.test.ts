import {
    some,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    LazyList,
    lazyList,
    lazyTail,
} from '../index';

test('empty', () => {
    const x = exArray<number>([]).end(some((x) => x > 1));
    expect(x).toBe(false);
});

test('true', () => {
    const x = exArray([1, 2, 1]).end(some((x) => x > 1));
    expect(x).toBe(true);
});

test('false', () => {
    const x = exArray([1, 2, 1]).end(some((x) => x < 1));
    expect(x).toBe(false);
});

test('exGenerator', () => {
    function* infinite() {
        while (true) yield 5;
    }

    const x = exGenerator(infinite()).end(some((x) => x > 1));
    expect(x).toBe(true);
});

test('exIterable', () => {
    const infinite = {
        *[Symbol.iterator]() {
            while (true) yield 5;
        },
    };

    const x = exIterable(infinite).end(some((x) => x > 1));
    expect(x).toBe(true);
});

test('exLazyList', () => {
    const infinite: LazyList<number> = lazyList(() => lazyTail(5, infinite));
    const x = exLazyList(infinite).end(some((x) => x > 1));
    expect(x).toBe(true);
});
