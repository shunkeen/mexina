import {
    findIndex,
    NotFoundError,
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
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(1);
});

test('not found', () => {
    const x = exArray([1, 2, 3]).end(findIndex((x) => x > 5));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(NotFoundError);
    expect(x.cause.message).toBe('mexina.findIndex: not found');
});

test('exGenerator', () => {
    function* infinite() {
        while (true) yield* [1, 2, 3];
    }

    const x = exGenerator(infinite()).end(findIndex((x) => x > 1));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(1);
});

test('exIterable', () => {
    const infinite = {
        *[Symbol.iterator]() {
            while (true) yield* [1, 2, 3];
        },
    };

    const x = exIterable(infinite).end(findIndex((x) => x > 1));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(1);
});

test('exLazyList', () => {
    const ll1: LazyList<number> = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll1));

    const x = exLazyList(ll1).end(findIndex((x) => x > 1));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(1);
});
