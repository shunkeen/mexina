import {
    entries,
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
    const array = exArray<string>([]).pipe(entries()).get;
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = exArray(['a', 'b', 'c']).pipe(entries()).get;
    expect(array).toStrictEqual([
        [0, 'a'],
        [1, 'b'],
        [2, 'c'],
    ]);
});

test('exGenerator', () => {
    function* generator() {
        yield* ['a', 'b', 'c'];
    }

    const array = exGenerator(generator()).pipe(entries()).end(toArray());
    expect(array).toStrictEqual([
        [0, 'a'],
        [1, 'b'],
        [2, 'c'],
    ]);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* ['a', 'b', 'c'];
        },
    };

    const array = exIterable(iterable).pipe(entries()).end(toArray());
    expect(array).toStrictEqual([
        [0, 'a'],
        [1, 'b'],
        [2, 'c'],
    ]);
});

test('exLazyList', () => {
    const llA = lazyList(() => lazyTail('a', llB));
    const llB = lazyList(() => lazyTail('b', llC));
    const llC = lazyList(() => lazyTail('c', llNil));
    const llNil = lazyList<string>(() => nil);

    const array = exLazyList(llA).pipe(entries()).end(toArray());
    expect(array).toStrictEqual([
        [0, 'a'],
        [1, 'b'],
        [2, 'c'],
    ]);
});
