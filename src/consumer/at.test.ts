import {
    at,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    LazyList,
    lazyList,
    lazyTail,
} from '../index';

test('first', () => {
    const x = exArray(['a', 'b', 'c']).end(at(0));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('a');
});

test('last', () => {
    const x = exArray(['a', 'b', 'c']).end(at(2));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('c');
});

test('negative index', () => {
    const x = exArray(['a', 'b', 'c']).end(at(-1));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(RangeError);
    expect(x.cause.message).toBe('mexina.at: negative index');
});

test('index too large', () => {
    const x = exArray(['a', 'b', 'c']).end(at(3));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(RangeError);
    expect(x.cause.message).toBe('mexina.at: index too large');
});

test('empty', () => {
    const x = exArray([]).end(at(0));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(RangeError);
    expect(x.cause.message).toBe('mexina.at: index too large');
});

test('exGenerator', () => {
    function* infinite() {
        while (true) yield* ['a', 'b', 'c'];
    }

    const x = exGenerator(infinite()).end(at(1));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('b');
});

test('exIterable', () => {
    const infinite = {
        *[Symbol.iterator]() {
            while (true) yield* ['a', 'b', 'c'];
        },
    };

    const x = exIterable(infinite).end(at(1));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('b');
});

test('exLazyList', () => {
    const llA: LazyList<string> = lazyList(() => lazyTail('a', llB));
    const llB = lazyList(() => lazyTail('b', llC));
    const llC = lazyList(() => lazyTail('c', llA));

    const x = exLazyList(llA).end(at(1));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('b');
});
