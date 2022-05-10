import {
    find,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    LazyList,
    lazyList,
    lazyTail,
} from '../index';

test('found', () => {
    const x = exArray([1, 2, 3]).end(find((x) => x > 1));
    expect(x).toBe(2);
});

test('not found', () => {
    const x = exArray([1, 2, 3]).end(find((x) => x > 5));
    expect(x).toBe(undefined);
});

test('empty', () => {
    const x = exArray([]).end(find((x) => x > 5));
    expect(x).toBe(undefined);
});

test('found with type guard', () => {
    const isString = (x: unknown): x is string => typeof x === 'string';
    const x = exArray([1, 'b', 3]).end(find(isString));
    expect(x).toBe('b');

    if (x === undefined) throw new TypeError('undefined');
    const _: string = x;
    void _; // type test
});

test('not found with type guard', () => {
    const isString = (x: unknown): x is string => typeof x === 'string';
    const x = exArray([1, 2, 3]).end(find(isString));
    expect(x).toBe(undefined);
});

test('empty with type guard', () => {
    const isString = (x: unknown): x is string => typeof x === 'string';
    const x = exArray([]).end(find(isString));
    expect(x).toBe(undefined);
});

test('exGenerator', () => {
    function* infinite() {
        while (true) yield* [1, 2, 3];
    }

    const x = exGenerator(infinite()).end(find((x) => x > 1));
    expect(x).toBe(2);
});

test('exIterable', () => {
    const infinite = {
        *[Symbol.iterator]() {
            while (true) yield* [1, 2, 3];
        },
    };

    const x = exIterable(infinite).end(find((x) => x > 1));
    expect(x).toBe(2);
});

test('exLazyList', () => {
    const ll1: LazyList<number> = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll1));

    const x = exLazyList(ll1).end(find((x) => x > 1));
    expect(x).toBe(2);
});
