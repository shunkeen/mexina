import {
    reduce,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('empty', () => {
    const x = exArray([]).end(reduce('numbers:', (x, y) => x + y));
    expect(x).toBe('numbers:');
});

test('non empty', () => {
    const x = exArray([1, 2, 3, 4]).end(reduce('numbers:', (x, y) => x + y));
    expect(x).toBe('numbers:1234');
});

test('exGenerator', () => {
    function* generator() {
        yield* [1, 2, 3, 4];
    }

    const x = exGenerator(generator()).end(reduce('numbers:', (x, y) => x + y));
    expect(x).toBe('numbers:1234');
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2, 3, 4];
        },
    };

    const x = exIterable(iterable).end(reduce('numbers:', (x, y) => x + y));
    expect(x).toBe('numbers:1234');
});

test('exLazyList', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll4));
    const ll4 = lazyList(() => lazyTail(4, llNil));
    const llNil = lazyList<number>(() => nil);

    const x = exLazyList(ll1).end(reduce('numbers:', (x, y) => x + y));
    expect(x).toBe('numbers:1234');
});
