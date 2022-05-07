import {
    map,
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
    const array = exArray<number>([]).pipe(map((x) => x.toString())).get;
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = exArray([1, 2, 3]).pipe(map((x) => x.toString())).get;
    expect(array).toStrictEqual(['1', '2', '3']);
});

test('exGenerator', () => {
    function* generator() {
        yield* [1, 2, 3];
    }

    const array = exGenerator(generator())
        .pipe(map((x) => x.toString()))
        .end(toArray());

    expect(array).toStrictEqual(['1', '2', '3']);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2, 3];
        },
    };

    const array = exIterable(iterable)
        .pipe(map((x) => x.toString()))
        .end(toArray());

    expect(array).toStrictEqual(['1', '2', '3']);
});

test('exLazyList', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, llNil));
    const llNil = lazyList<number>(() => nil);

    const array = exLazyList(ll1)
        .pipe(map((x) => x.toString()))
        .end(toArray());

    expect(array).toStrictEqual(['1', '2', '3']);
});
