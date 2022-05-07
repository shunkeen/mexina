import {
    every,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    LazyList,
    lazyList,
    lazyTail,
} from '../index';

test('empty', () => {
    const x = exArray<number>([]).end(every((x) => x < 3));
    expect(x).toBe(true);
});

test('true', () => {
    const x = exArray([1, 2, 1]).end(every((x) => x < 3));
    expect(x).toBe(true);
});

test('false', () => {
    const x = exArray([1, 5, 1]).end(every((x) => x < 3));
    expect(x).toBe(false);
});

test('exGenerator', () => {
    function* infinite() {
        while (true) yield 5;
    }

    const x = exGenerator(infinite()).end(every((x) => x < 3));
    expect(x).toBe(false);
});

test('exIterable', () => {
    const infinite = {
        *[Symbol.iterator]() {
            while (true) yield 5;
        },
    };

    const x = exIterable(infinite).end(every((x) => x < 3));
    expect(x).toBe(false);
});

test('exLazyList', () => {
    const infinite: LazyList<number> = lazyList(() => lazyTail(5, infinite));
    const x = exLazyList(infinite).end(every((x) => x < 3));
    expect(x).toBe(false);
});
