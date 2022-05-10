import {
    indexOf,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    LazyList,
    lazyList,
    lazyTail,
} from '../index';

test('found', () => {
    const x = exArray(['a', 'b', 'c']).end(indexOf('b'));
    expect(x).toBe(1);
});

test('not found', () => {
    const x = exArray(['a', 'b', 'c']).end(indexOf('!'));
    expect(x).toBe(-1);
});

test('empty', () => {
    const x = exArray([]).end(indexOf('!'));
    expect(x).toBe(-1);
});

test('exGenerator', () => {
    function* infinite() {
        while (true) yield* ['a', 'b', 'c'];
    }

    const x = exGenerator(infinite()).end(indexOf('b'));
    expect(x).toBe(1);
});

test('exIterable', () => {
    const infinite = {
        *[Symbol.iterator]() {
            while (true) yield* ['a', 'b', 'c'];
        },
    };

    const x = exIterable(infinite).end(indexOf('b'));
    expect(x).toBe(1);
});

test('exLazyList', () => {
    const llA: LazyList<string> = lazyList(() => lazyTail('a', llB));
    const llB = lazyList(() => lazyTail('b', llC));
    const llC = lazyList(() => lazyTail('c', llA));

    const x = exLazyList(llA).end(indexOf('b'));
    expect(x).toBe(1);
});
