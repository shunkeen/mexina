import {
    flatMap,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    fromArray,
    toArray,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('empty', () => {
    const array = exArray([]).pipe(flatMap(fromArray)).get;
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const nested = [[1, 2, 3], [4, 5], [6], []];
    const array = exArray(nested).pipe(flatMap(fromArray)).get;
    expect(array).toStrictEqual([1, 2, 3, 4, 5, 6]);
});

test('exGenerator', () => {
    function* generator() {
        yield* [[1, 2, 3], [4, 5], [6], []];
    }

    const array = exGenerator(generator())
        .pipe(flatMap(fromArray))
        .end(toArray());

    expect(array).toStrictEqual([1, 2, 3, 4, 5, 6]);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [[1, 2, 3], [4, 5], [6], []];
        },
    };

    const array = exIterable(iterable).pipe(flatMap(fromArray)).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4, 5, 6]);
});

test('exLazyList', () => {
    const ll1 = lazyList(() => lazyTail([1, 2, 3], ll2));
    const ll2 = lazyList(() => lazyTail([4, 5], ll3));
    const ll3 = lazyList(() => lazyTail([6], ll4));
    const ll4 = lazyList(() => lazyTail([], llNil));
    const llNil = lazyList<ReadonlyArray<number>>(() => nil);

    const array = exLazyList(ll1).pipe(flatMap(fromArray)).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4, 5, 6]);
});
