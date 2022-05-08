import {
    keys,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    toArray,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('empty', () => {
    const array = exArray<string>([]).pipe(keys).get;
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = exArray(['a', 'b', 'c']).pipe(keys).get;
    expect(array).toStrictEqual([0, 1, 2]);
});

test('exGenerator', () => {
    function* generator() {
        yield* ['a', 'b', 'c'];
    }

    const array = exGenerator(generator()).pipe(keys).end(toArray());
    expect(array).toStrictEqual([0, 1, 2]);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* ['a', 'b', 'c'];
        },
    };

    const array = exIterable(iterable).pipe(keys).end(toArray());
    expect(array).toStrictEqual([0, 1, 2]);
});

test('exLazyList', () => {
    const llA = lazyList(() => lazyTail('a', llB));
    const llB = lazyList(() => lazyTail('b', llC));
    const llC = lazyList(() => lazyTail('c', llNil));
    const llNil = lazyList<string>(() => nil);

    const array = exLazyList(llA).pipe(keys).end(toArray());
    expect(array).toStrictEqual([0, 1, 2]);
});
