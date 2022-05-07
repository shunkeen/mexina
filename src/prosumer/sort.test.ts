import {
    sort,
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
    const array = exArray<string>([]).pipe(sort()).get;
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = exArray([1, 30, 4, 21, 100000]).pipe(sort()).get;
    expect(array).toStrictEqual([1, 100000, 21, 30, 4]);
});

test('compare', () => {
    const sortNumber = sort<number>((x, y) => x - y);
    const array = exArray([1, 30, 4, 21, 100000]).pipe(sortNumber).get;
    expect(array).toStrictEqual([1, 4, 21, 30, 100000]);
});

test('exGenerator', () => {
    function* generator() {
        yield* ['D', 'A', 'C', 'B'];
    }

    const array = exGenerator(generator()).pipe(sort()).end(toArray());
    expect(array).toStrictEqual(['A', 'B', 'C', 'D']);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* ['D', 'A', 'C', 'B'];
        },
    };

    const array = exIterable(iterable).pipe(sort()).end(toArray());
    expect(array).toStrictEqual(['A', 'B', 'C', 'D']);
});

test('exLazyList', () => {
    const llD = lazyList(() => lazyTail('D', llA));
    const llA = lazyList(() => lazyTail('A', llC));
    const llC = lazyList(() => lazyTail('C', llB));
    const llB = lazyList(() => lazyTail('B', llNil));
    const llNil = lazyList<string>(() => nil);

    const array = exLazyList(llD).pipe(sort()).end(toArray());
    expect(array).toStrictEqual(['A', 'B', 'C', 'D']);
});
