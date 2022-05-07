import {
    detect,
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
    const isString = (x: unknown): x is string => typeof x === 'string';
    const x = exArray([1, 'b', 3]).end(detect(isString));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('b');
});

test('not found', () => {
    const isString = (x: unknown): x is string => typeof x === 'string';
    const x = exArray([1, 2, 3]).end(detect(isString));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(NotFoundError);
    expect(x.cause.message).toBe('mexina.detect: not found');
});

test('empty', () => {
    const isString = (x: unknown): x is string => typeof x === 'string';
    const x = exArray([]).end(detect(isString));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(NotFoundError);
    expect(x.cause.message).toBe('mexina.detect: not found');
});

test('exGenerator', () => {
    function* infinite() {
        while (true) yield* [1, 'b', 3];
    }

    const isString = (x: unknown): x is string => typeof x === 'string';
    const x = exGenerator(infinite()).end(detect(isString));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('b');
});

test('exIterable', () => {
    const infinite = {
        *[Symbol.iterator]() {
            while (true) yield* [1, 'b', 3];
        },
    };

    const isString = (x: unknown): x is string => typeof x === 'string';
    const x = exIterable(infinite).end(detect(isString));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('b');
});

test('exLazyList', () => {
    const ll1: LazyList<number | string> = lazyList(() => lazyTail(1, llB));
    const llB = lazyList(() => lazyTail('b', ll3));
    const ll3 = lazyList(() => lazyTail(3, ll1));

    const isString = (x: unknown): x is string => typeof x === 'string';
    const x = exLazyList(ll1).end(detect(isString));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('b');
});
