import {
    reduce1,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('empty', () => {
    const x = exArray<number>([]).end(reduce1((x, y) => x + y));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(RangeError);
    expect(x.cause.message).toBe('mexina.reduce1: index out of range');
});

test('non empty', () => {
    const x = exArray([1, 2, 3, 4]).end(reduce1((x, y) => x + y));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(10);
});

test('exGenerator', () => {
    function* generator() {
        yield* [1, 2, 3, 4];
    }

    const x = exGenerator(generator()).end(reduce1((x, y) => x + y));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(10);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2, 3, 4];
        },
    };

    const x = exIterable(iterable).end(reduce1((x, y) => x + y));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(10);
});

test('exLazyList', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll4));
    const ll4 = lazyList(() => lazyTail(4, llNil));
    const llNil = lazyList<number>(() => nil);

    const x = exLazyList(ll1).end(reduce1((x, y) => x + y));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(10);
});
